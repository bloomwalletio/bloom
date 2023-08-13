<script lang="ts">
    import { getSelectedAccount, selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { EvmTransactionData } from '@core/layer-2'
    import { IChain, getNetwork } from '@core/network'
    import { truncateString } from '@core/utils'
    import { Output, SendFlowParameters, SubjectType } from '@core/wallet'
    import {
        createEvmTransactionFromSendFlowParameters,
        createStardustOutputFromSendFlowParameters,
        sendOutputFromStardust,
        sendTransactionFromEvm,
    } from '@core/wallet/actions'
    import { getNetworkIdFromSendFlowParameters } from '@core/wallet/actions/getNetworkIdFromSendFlowParameters'
    import { sendFlowParameters } from '@core/wallet/stores'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { onMount } from 'svelte'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'
    import { EvmTransactionSummary, StardustTransactionSummary } from './components'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    $: void updateSendFlow($sendFlowParameters)
    $: isAssetFromLayer2 = !!chain
    $: isTransferring = !!$selectedAccount.isTransferring

    let recipientAddress: string
    let preparedOutput: Output | undefined
    let preparedTransaction: EvmTransactionData | undefined
    let chain: IChain | undefined

    async function updateSendFlow(sendFlowParameters: SendFlowParameters): Promise<void> {
        const { recipient } = sendFlowParameters

        recipientAddress =
            recipient.type === SubjectType.Account ? recipient.account.name : truncateString(recipient?.address, 6, 6)

        const networkId = getNetworkIdFromSendFlowParameters(sendFlowParameters)
        if (networkId) {
            chain = getNetwork()?.getChain(networkId)
            const account = getSelectedAccount()

            preparedTransaction = await createEvmTransactionFromSendFlowParameters(sendFlowParameters, chain, account)
        } else {
            preparedOutput = await createStardustOutputFromSendFlowParameters(sendFlowParameters, $selectedAccountIndex)
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
