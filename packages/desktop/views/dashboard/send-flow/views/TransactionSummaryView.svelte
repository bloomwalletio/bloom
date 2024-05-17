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
    import { Converter, MILLISECONDS_PER_SECOND, truncateString } from '@core/utils'
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
    import { onDestroy, onMount } from 'svelte'
    import { sendFlowRouter } from '../send-flow.router'
    import { EvmTransactionSummary, StardustToEvmTransactionSummary, StardustTransactionSummary } from './components'
    import { TransactionSummaryProps } from './types'
    import { GasSpeed, IGasPricesBySpeed } from '@core/layer-2'

    export let transactionSummaryProps: TransactionSummaryProps | undefined
    let { _onMount, preparedOutput, preparedTransaction } = transactionSummaryProps ?? {}

    let selectedGasSpeed = GasSpeed.Required
    let gasPrices: IGasPricesBySpeed = {
        [GasSpeed.Required]: Converter.bigIntLikeToBigInt(preparedTransaction?.gasPrice as number),
    }

    $: void prepareTransactions($sendFlowParameters)
    $: isSourceNetworkLayer2 = !!evmNetwork
    $: isDestinationNetworkLayer2 = isEvmNetwork($sendFlowParameters?.destinationNetworkId)
    $: isDisabled = isInvalid || !hasMounted || (!preparedTransaction && !preparedOutput)

    let hasMounted = false
    let isInvalid: boolean
    let busy = false
    let recipientAddress: string
    let evmNetwork: IEvmNetwork | undefined

    async function prepareTransactions(sendFlowParameters: SendFlowParameters | undefined): Promise<void> {
        if (_onMount || !sendFlowParameters || !$selectedAccount) {
            // The unlock stronghold/ledger flow passes the _onMount prop and the preparedTransactions
            return
        }

        try {
            const { recipient } = sendFlowParameters

            recipientAddress =
                recipient?.type === SubjectType.Account
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

    async function setGasPrices(): Promise<void> {
        const _gasPrices = await evmNetwork?.getGasPrices()
        if (_gasPrices) {
            gasPrices = { ...gasPrices, ..._gasPrices }
        }
    }

    async function onConfirmClick(): Promise<void> {
        if (!isValidTransaction() || !$selectedAccount) {
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
            if (preparedTransaction && evmNetwork) {
                preparedTransaction.gasPrice = Converter.bigIntToHex(
                    gasPrices?.[selectedGasSpeed] ?? gasPrices.required
                )
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
            } else if (preparedOutput) {
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

    let intervalId: NodeJS.Timeout
    onMount(async () => {
        try {
            if (isSourceNetworkLayer2 || isDestinationNetworkLayer2) {
                await setGasPrices()
                intervalId = setInterval(() => void setGasPrices, MILLISECONDS_PER_SECOND * 10)
            }
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

    onDestroy(() => {
        clearInterval(intervalId)
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
            bind:selectedGasSpeed
            {gasPrices}
            transaction={preparedTransaction}
            sendFlowParameters={$sendFlowParameters}
            network={evmNetwork}
            {busy}
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
