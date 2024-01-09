<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { selectedAccountIndex } from '@core/account/stores'
    import { buySellRoute, BuySellRoute, buySellRouter } from '@core/router'
    import { BuySellMainView } from './views'

    $: $selectedAccountIndex !== undefined && $buySellRouter.reset()

    $: if (features.analytics.dashboardRoute.buySell.enabled && $buySellRoute) {
        Platform.trackEvent('buy-sell-route', { route: $buySellRoute })
    }
</script>

<div class="w-full h-full flex flex-col flex-nowrap p-8 relative flex-1">
    {#if $buySellRoute === BuySellRoute.Main}
        <BuySellMainView />
    {/if}
</div>
