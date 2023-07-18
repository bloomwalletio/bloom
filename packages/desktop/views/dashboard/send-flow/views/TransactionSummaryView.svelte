<script lang="ts">
    import { closePopup } from '@desktop/auxiliary/popup'
    import { getSelectedAccount, selectedAccount, selectedAccountIndex } from '@core/account'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { NewTransactionType, newTransactionData } from '@core/wallet/stores'
    import {
        createEvmTransaction,
        prepareOutputFromTransactionData,
        sendOutputFromStardust,
        sendTransactionFromEvm,
    } from '@core/wallet/utils'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'
    import { EvmTransactionSummary, StardustTransactionSummary } from './components'
    import { truncateString } from '@core/utils'
    import { Output, TransactionData } from '@core/wallet'
    import { IChain, getNetwork } from '@core/network'
    import { EvmTransactionData } from '@core/layer-2'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    $: void updateSendFlow($newTransactionData)
    $: isAssetFromLayer2 = !!chain
    $: isTransferring = !!$selectedAccount.isTransferring

    let recipientAddress: string
    let preparedOutput: Output | undefined
    let preparedTransaction: EvmTransactionData | undefined
    let chain: IChain | undefined

    async function updateSendFlow(transactionData: TransactionData): Promise<void> {
        const { recipient, type } = transactionData

        recipientAddress =
            recipient.type === 'account' ? recipient.account.name : truncateString(recipient?.address, 6, 6)

        const chainId = type === NewTransactionType.TokenTransfer ? transactionData.asset.chainId : undefined
        if (chainId) {
            chain = getNetwork()?.getChain(chainId)
            const account = getSelectedAccount()

            preparedTransaction = await createEvmTransaction(chain, account)
        } else {
            preparedOutput = await prepareOutputFromTransactionData($selectedAccountIndex)
        }
    }

    async function onConfirmClick(): Promise<void> {
        try {
            if (isAssetFromLayer2) {
                await sendTransactionFromEvm(preparedTransaction, chain, closePopup)
            } else {
                await sendOutputFromStardust(preparedOutput, closePopup)
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
        <EvmTransactionSummary transaction={preparedTransaction} />
    {:else if !isAssetFromLayer2 && preparedOutput}
        <StardustTransactionSummary output={preparedOutput} />
    {/if}
</SendFlowTemplate>
