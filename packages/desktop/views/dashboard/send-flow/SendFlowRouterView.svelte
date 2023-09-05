<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { SendFlowRoute } from './send-flow-route.enum'
    import { sendFlowRoute } from './send-flow.router'
    import { InputTokenAmountView, SelectRecipientView, SelectTokenView, TransactionSummaryView } from './views'
    import { onDestroy } from 'svelte'
    import { stopPollingEvmChainGasPrices } from '@core/layer-2/actions'

    export let onTransactionSummaryMount: (..._: any[]) => Promise<void> = async () => {}

    $: if (features.analytics.dashboardRoute.wallet.sendFlow.enabled && $sendFlowRoute) {
        Platform.trackEvent('send-flow-route', { route: $sendFlowRoute })
    }

    onDestroy(() => {
        stopPollingEvmChainGasPrices()
    })
</script>

<send-flow-router>
    {#if $sendFlowRoute === SendFlowRoute.SelectToken}
        <SelectTokenView />
    {:else if $sendFlowRoute === SendFlowRoute.InputTokenAmount}
        <InputTokenAmountView />
    {:else if $sendFlowRoute === SendFlowRoute.SelectRecipient}
        <SelectRecipientView />
    {:else if $sendFlowRoute === SendFlowRoute.TransactionSummary}
        <TransactionSummaryView _onMount={onTransactionSummaryMount} />
    {/if}
</send-flow-router>
