<script lang="ts">
    import { closePopup } from '@desktop/auxiliary/popup'
    import { getSelectedAccount, selectedAccount, selectedAccountIndex } from '@core/account'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { SendFlowType, sendFlowParameters } from '@core/wallet/stores'
    import {
        createEvmTransactionFromTransactionData,
        createStardustOutputFromTransactionData,
        sendOutputFromStardust,
        sendTransactionFromEvm,
    } from '@core/wallet/actions'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'
    import { EvmTransactionSummary, StardustTransactionSummary } from './components'
    import { truncateString } from '@core/utils'
    import { Output, SendFlowParameters } from '@core/wallet'
    import { IChain, getNetwork } from '@core/network'
    import { EvmTransactionData } from '@core/layer-2'
    import { onMount } from 'svelte'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    $: void updateSendFlow($sendFlowParameters)
    $: isAssetFromLayer2 = !!chain
    $: isTransferring = !!$selectedAccount.isTransferring

    let recipientAddress: string
    let preparedOutput: Output | undefined
    let preparedTransaction: EvmTransactionData | undefined
    let chain: IChain | undefined

    async function updateSendFlow(sendFlowParameters: SendFlowParameters): Promise<void> {
        const { recipient, type } = sendFlowParameters

        recipientAddress =
            recipient.type === 'account' ? recipient.account.name : truncateString(recipient?.address, 6, 6)

        const chainId =
            type === SendFlowType.TokenTransfer
                ? sendFlowParameters.tokenTransfer.asset?.chainId
                : sendFlowParameters.baseCoinTransfer.asset?.chainId
        if (chainId) {
            chain = getNetwork()?.getChain(chainId)
            const account = getSelectedAccount()

            preparedTransaction = await createEvmTransactionFromTransactionData(sendFlowParameters, chain, account)
        } else {
            preparedOutput = await createStardustOutputFromTransactionData(sendFlowParameters, $selectedAccountIndex)
        }
    }

    async function onConfirmClick(): Promise<void> {
        try {
            if (isAssetFromLayer2) {
                await sendTransactionFromEvm(preparedTransaction, chain, closePopup)
            } else {
                await sendOutputFromStardust(preparedOutput, $selectedAccount, closePopup)
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
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<SendFlowTemplate
    title={localize('popups.transaction.transactionSummary', { values: { recipient: recipientAddress } })}
    leftButton={{
        text: localize($sendFlowRouter.hasHistory() ? 'actions.back' : 'actions.cancel'),
        onClick: onBackClick,
        disabled: isTransferring,
    }}
    rightButton={{
        text: localize('actions.confirm'),
        onClick: onConfirmClick,
        disabled: isTransferring,
        isBusy: isTransferring,
    }}
>
    {#if isAssetFromLayer2 && preparedTransaction}
        <EvmTransactionSummary transaction={preparedTransaction} sendFlowParameters={$sendFlowParameters} />
    {:else if !isAssetFromLayer2 && preparedOutput}
        <StardustTransactionSummary output={preparedOutput} sendFlowParameters={$sendFlowParameters} />
    {/if}
</SendFlowTemplate>
