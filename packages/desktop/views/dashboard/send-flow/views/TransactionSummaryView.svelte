<script lang="ts">
    import { closePopup } from '@desktop/auxiliary/popup'
    import { selectedAccount } from '@core/account'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { NewTransactionType, newTransactionData } from '@core/wallet/stores'
    import { createTransaction } from '@core/wallet/utils'
    import { get } from 'svelte/store'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'
    import { EvmTransactionSummary, StardustTransactionSummary } from './components'
    import { truncateString } from '@core/utils'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    $: transactionData = get(newTransactionData)
    $: recipient =
        transactionData.recipient.type === 'account'
            ? transactionData.recipient.account.name
            : truncateString(transactionData.recipient?.address, 6, 6)
    $: isTransferring = !!$selectedAccount.isTransferring
    $: isAssetFromLayer2 =
        transactionData.type === NewTransactionType.TokenTransfer ? !!transactionData.asset.chainId : false

    async function onConfirmClick(): Promise<void> {
        try {
            await createTransaction(transactionData, $selectedAccount.index, () => closePopup())
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
</script>

<SendFlowTemplate
    title={localize('popups.transaction.transactionSummary', { values: { recipient } })}
    leftButton={{
        text: localize($sendFlowRouter.hasHistory() ? 'actions.back' : 'actions.cancel'),
        onClick: onBackClick,
    }}
    rightButton={{
        text: localize('actions.confirm'),
        onClick: onConfirmClick,
        disabled: isTransferring,
        isBusy: isTransferring,
    }}
>
    {#if isAssetFromLayer2}
        <EvmTransactionSummary {_onMount} />
    {:else}
        <StardustTransactionSummary {_onMount} />
    {/if}
</SendFlowTemplate>
