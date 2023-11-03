<script lang="ts">
    import { Spinner } from '@bloomwalletio/ui'
    import { PopupTemplate } from '@components'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { IChain, getNetwork, isEvmChain } from '@core/network'
    import { truncateString } from '@core/utils'
    import { SendFlowParameters, SubjectType } from '@core/wallet'
    import {
        createEvmTransactionFromSendFlowParameters,
        createStardustOutputFromSendFlowParameters,
        sendOutputFromStardust,
        sendTransactionFromEvm,
    } from '@core/wallet/actions'
    import { sendFlowParameters } from '@core/wallet/stores'
    import { getNetworkIdFromSendFlowParameters } from '@core/wallet/utils'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { modifyPopupState } from '@desktop/auxiliary/popup/helpers'
    import { onMount } from 'svelte'
    import { sendFlowRouter } from '../send-flow.router'
    import { EvmTransactionSummary, StardustToEvmTransactionSummary, StardustTransactionSummary } from './components'
    import { TransactionSummaryProps } from './types'
    import { setGasFee } from '@core/layer-2/actions'

    export let transactionSummaryProps: TransactionSummaryProps
    let { _onMount, preparedOutput, preparedTransaction } = transactionSummaryProps ?? {}

    $: void prepareTransactions($sendFlowParameters)
    $: isSourceNetworkLayer2 = !!chain
    $: isDestinationNetworkLayer2 = isEvmChain($sendFlowParameters.destinationNetworkId)
    $: isTransferring = !!$selectedAccount?.isTransferring
    $: isDisabled = isInvalid || isTransferring || (!preparedTransaction && !preparedOutput)

    let isInvalid: boolean
    let recipientAddress: string
    let chain: IChain | undefined

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

            const networkId = getNetworkIdFromSendFlowParameters(sendFlowParameters)
            if (isEvmChain(networkId)) {
                chain = getNetwork()?.getChain(networkId)
                preparedTransaction = await createEvmTransactionFromSendFlowParameters(
                    sendFlowParameters,
                    chain,
                    $selectedAccount
                )
            } else {
                preparedOutput = await createStardustOutputFromSendFlowParameters(sendFlowParameters, $selectedAccount)
            }
        } catch (err) {
            handleError(err)
        }
    }

    function finish(): void {
        modifyPopupState({ confirmClickOutside: false })
        closePopup()
    }

    async function onConfirmClick(): Promise<void> {
        try {
            if (isSourceNetworkLayer2) {
                await sendTransactionFromEvm(preparedTransaction, chain, finish)
            } else {
                await sendOutputFromStardust(preparedOutput, $selectedAccount, finish)
            }
        } catch (err) {
            handleError(err)
        }
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
        }
    })
</script>

<PopupTemplate
    title={localize('popups.transaction.transactionSummary', { values: { recipient: recipientAddress } })}
    backButton={{
        text: localize($sendFlowRouter.hasHistory() ? 'actions.back' : 'actions.cancel'),
        onClick: onBackClick,
        disabled: isTransferring,
    }}
    continueButton={{
        text: localize('actions.confirm'),
        onClick: onConfirmClick,
        disabled: isDisabled,
    }}
    busy={isTransferring}
>
    {#if isSourceNetworkLayer2 && preparedTransaction}
        <EvmTransactionSummary transaction={preparedTransaction} sendFlowParameters={$sendFlowParameters} />
    {:else if !isSourceNetworkLayer2 && preparedOutput}
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
            <Spinner />
        </div>
    {/if}
</PopupTemplate>
