<script lang="ts">
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { EvmTransactionData } from '@core/layer-2'
    import { IChain, getNetwork, isEvmChain } from '@core/network'
    import { truncateString } from '@core/utils'
    import { Output, SendFlowParameters, SubjectType } from '@core/wallet'
    import {
        createEvmTransactionFromSendFlowParameters,
        createStardustOutputFromSendFlowParameters,
        sendOutputFromStardust,
        sendTransactionFromEvm,
    } from '@core/wallet/actions'
    import { getNetworkIdFromSendFlowParameters } from '@core/wallet/utils'
    import { sendFlowParameters } from '@core/wallet/stores'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { onMount } from 'svelte'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'
    import { EvmTransactionSummary, StardustTransactionSummary, StardustToEvmTransactionSummary } from './components'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    $: void updateSendFlow($sendFlowParameters)
    $: isSourceNetworkLayer2 = !!chain
    $: isDestinationNetworkLayer2 = isEvmChain($sendFlowParameters.destinationNetworkId)
    $: isTransferring = !!$selectedAccount.isTransferring

    let isDisabled: boolean
    let recipientAddress: string
    let preparedOutput: Output | undefined
    let preparedTransaction: EvmTransactionData | undefined
    let chain: IChain | undefined

    async function updateSendFlow(sendFlowParameters: SendFlowParameters): Promise<void> {
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

    async function onConfirmClick(): Promise<void> {
        try {
            if (isSourceNetworkLayer2) {
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
        disabled: isDisabled || isTransferring,
        isBusy: isTransferring,
    }}
>
    {#if isSourceNetworkLayer2 && preparedTransaction}
        <EvmTransactionSummary transaction={preparedTransaction} sendFlowParameters={$sendFlowParameters} />
    {:else if !isSourceNetworkLayer2 && preparedOutput}
        {#if isDestinationNetworkLayer2}
            <StardustToEvmTransactionSummary output={preparedOutput} sendFlowParameters={$sendFlowParameters} />
        {:else}
            <StardustTransactionSummary
                bind:isDisabled
                output={preparedOutput}
                sendFlowParameters={$sendFlowParameters}
            />
        {/if}
    {/if}
</SendFlowTemplate>
