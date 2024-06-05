<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { BuySellMainView, NewBuySellMainView } from './views'
    import { dashboardRoute, DashboardRoute } from '@core/router'

    $: if (features.analytics.dashboardRoute.buySell.enabled && $dashboardRoute === DashboardRoute.BuySell) {
        Platform.trackEvent('buy-sell-route', { route: $dashboardRoute })
    }
</script>

<div class="w-full h-full flex flex-col flex-nowrap p-8 relative flex-1">
    <!-- <BuySellMainView /> -->
    <NewBuySellMainView />
</div>
