<script lang="ts">
    import { showNotification } from '@auxiliary/notification'
    import { Spinner } from '@bloomwalletio/ui'
    import { PopupTemplate } from '@components'
    import { getSelectedAccount, selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { setGasFee } from '@core/layer-2/actions'
    import { LedgerAppName, ledgerPreparedOutput } from '@core/ledger'
    import { IEvmNetwork, getNetwork, isEvmNetwork } from '@core/network'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { getActiveProfileId, getIsActiveLedgerProfile } from '@core/profile/stores'
    import { truncateString } from '@core/utils'
    import { SendFlowParameters, SubjectType } from '@core/wallet'
    import {
        createEvmTransactionFromSendFlowParameters,
        createStardustOutputFromSendFlowParameters,
        sendAndPersistTransactionFromEvm,
        signAndSendStardustTransaction,
        signEvmTransaction,
    } from '@core/wallet/actions'
    import { sendFlowParameters } from '@core/wallet/stores'
    import { validateSendConfirmation } from '@core/wallet/utils'
    import { closePopup, modifyPopupState } from '@desktop/auxiliary/popup'
    import { onMount } from 'svelte'
    import { sendFlowRouter } from '../send-flow.router'
    import { EvmTransactionSummary, StardustToEvmTransactionSummary, StardustTransactionSummary } from './components'
    import { TransactionSummaryProps } from './types'

    export let transactionSummaryProps: TransactionSummaryProps
    let { _onMount, preparedOutput, preparedTransaction } = transactionSummaryProps ?? {}

    $: void prepareTransactions($sendFlowParameters)
    $: isSourceNetworkLayer2 = !!evmNetwork
    $: isDestinationNetworkLayer2 = isEvmNetwork($sendFlowParameters?.destinationNetworkId)
    $: isDisabled = isInvalid || !hasMounted || (!preparedTransaction && !preparedOutput)

    let hasMounted = false
    let isInvalid: boolean
    let busy = false
    let recipientAddress: string
    let evmNetwork: IEvmNetwork | undefined

    async function prepareTransactions(sendFlowParameters: SendFlowParameters): Promise<void> {
        if (_onMount) {
            // The unlock stronghold/ledger flow passes the _onMount prop and the preparedTransactions
            return
        }

        try {
            const { recipient } = sendFlowParameters

            recipientAddress =
                recipient.type === SubjectType.Account
                    ? recipient.account.name
                    : truncateString(recipient?.address, 6, 6)

            const { sourceNetworkId } = sendFlowParameters
            if (sourceNetworkId && isEvmNetwork(sourceNetworkId)) {
                evmNetwork = getNetwork(sourceNetworkId) as IEvmNetwork
                preparedTransaction = await createEvmTransactionFromSendFlowParameters(
                    sendFlowParameters,
                    evmNetwork,
                    $selectedAccount
                )
            } else {
                preparedOutput = await createStardustOutputFromSendFlowParameters(sendFlowParameters, $selectedAccount)
            }
        } catch (err) {
            handleError(err)
        }
    }

    function isValidTransaction(): boolean {
        if (isSourceNetworkLayer2) {
            return !!preparedTransaction
        } else {
            try {
                validateSendConfirmation(preparedOutput)

                if (getIsActiveLedgerProfile()) {
                    ledgerPreparedOutput.set(preparedOutput)
                }

                return true
            } catch (err) {
                handleError(err)
                return false
            }
        }
    }

    async function onConfirmClick(): Promise<void> {
        if (!isValidTransaction()) {
            return
        }

        try {
            await checkActiveProfileAuth(isSourceNetworkLayer2 ? LedgerAppName.Ethereum : undefined)
        } catch (error) {
            return
        }

        try {
            busy = true
            modifyPopupState({ preventClose: true })
            if (isSourceNetworkLayer2) {
                const signedTransaction = await signEvmTransaction(preparedTransaction, evmNetwork, $selectedAccount)
                const profileId = getActiveProfileId()
                const account = getSelectedAccount()

                await sendAndPersistTransactionFromEvm(
                    preparedTransaction,
                    signedTransaction,
                    evmNetwork,
                    profileId,
                    account
                )
            } else {
                await signAndSendStardustTransaction(preparedOutput, $selectedAccount)
            }
            modifyPopupState({ preventClose: false }, true)
            busy = false
        } catch (err) {
            busy = false
            modifyPopupState({ preventClose: false }, true)
            handleError(err)
            return
        }

        showNotification({
            variant: 'success',
            text: localize('notifications.transaction.success'),
        })
        modifyPopupState({ confirmClickOutside: false, preventClose: false })
        closePopup({ forceClose: true })
    }

    function onBackClick(): void {
        if (!$sendFlowRouter.hasHistory()) {
            closePopup()
        } else {
            $sendFlowRouter.previous()
        }
    }

    onMount(async () => {
        try {
            if (_onMount) {
                await _onMount()
            } else {
                await setGasFee($sendFlowParameters, $selectedAccount)
            }
        } catch (err) {
            handleError(err)
        } finally {
            hasMounted = true
        }
    })
</script>

<PopupTemplate
    title={localize('popups.transaction.transactionSummary', { values: { recipient: recipientAddress } })}
    backButton={{
        text: localize($sendFlowRouter.hasHistory() ? 'actions.back' : 'actions.cancel'),
        onClick: onBackClick,
        disabled: busy,
    }}
    continueButton={{
        text: localize('actions.confirm'),
        onClick: onConfirmClick,
        disabled: isDisabled,
    }}
    {busy}
>
    {#if isSourceNetworkLayer2 && preparedTransaction && $sendFlowParameters && evmNetwork}
        <EvmTransactionSummary
            transaction={preparedTransaction}
            sendFlowParameters={$sendFlowParameters}
            network={evmNetwork}
        />
    {:else if !isSourceNetworkLayer2 && preparedOutput && $sendFlowParameters}
        {#if isDestinationNetworkLayer2}
            <StardustToEvmTransactionSummary output={preparedOutput} sendFlowParameters={$sendFlowParameters} />
        {:else}
            <StardustTransactionSummary
                bind:isInvalid
                output={preparedOutput}
                sendFlowParameters={$sendFlowParameters}
            />
        {/if}
    {:else}
        <div class="flex justify-center">
            <Spinner textColor="primary" />
        </div>
    {/if}
</PopupTemplate>
