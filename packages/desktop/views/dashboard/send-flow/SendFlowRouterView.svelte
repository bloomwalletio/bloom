<script lang="ts">
    import { Platform } from '@core/app'
    import { SendFlowType, sendFlowParameters } from '@core/wallet'
    import { modifyPopupState } from '@desktop/auxiliary/popup/helpers'
    import features from '@features/features'
    import { SendFlowRoute } from './send-flow-route.enum'
    import { sendFlowRoute } from './send-flow.router'
    import { InputTokenAmountView, SelectRecipientView, SelectTokenView, TransactionSummaryView } from './views'
    import { TransactionSummaryProps } from './views/types'

    export let transactionSummaryProps: TransactionSummaryProps | undefined = undefined

    $: confirmClickOutside = !!(
        $sendFlowParameters?.recipient ||
        $sendFlowParameters?.baseCoinTransfer ||
        ($sendFlowParameters?.type === SendFlowType.TokenTransfer && $sendFlowParameters.tokenTransfer) ||
        ($sendFlowParameters?.type === SendFlowType.NftTransfer && $sendFlowParameters.nft)
    )
    $: confirmClickOutside, modifyPopupState({ confirmClickOutside })

    $: if (features.analytics.dashboardRoute.wallet.sendFlow.enabled && $sendFlowRoute) {
        Platform.trackEvent('send-flow-route', { route: $sendFlowRoute })
    }
</script>

<send-flow-router>
    {#if $sendFlowRoute === SendFlowRoute.SelectToken}
        <SelectTokenView />
    {:else if $sendFlowRoute === SendFlowRoute.InputTokenAmount}
        <InputTokenAmountView />
    {:else if $sendFlowRoute === SendFlowRoute.SelectRecipient}
        <SelectRecipientView />
    {:else if $sendFlowRoute === SendFlowRoute.TransactionSummary}
        <TransactionSummaryView {transactionSummaryProps} />
    {/if}
</send-flow-router>
