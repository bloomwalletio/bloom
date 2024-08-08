<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { BuySellMainView } from './views'
    import { dashboardRoute, DashboardRoute } from '@core/router'
    import { onMount } from 'svelte'
    import { updateTransakCryptoCurrencies, updateTransakFiatCurrencies } from '@auxiliary/transak'
    import { Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'

    $: if (features.analytics.dashboardRoute.buySell.enabled && $dashboardRoute === DashboardRoute.BuySell) {
        Platform.trackEvent('buy-sell-route', { route: $dashboardRoute })
    }

    onMount(() => {
        void updateTransakFiatCurrencies()
        void updateTransakCryptoCurrencies()
    })
</script>

<div class="w-full h-full flex flex-col flex-nowrap gap-4 p-8 relative flex-1">
    <Text type="h6">{localize('views.buySell.title')}</Text>
    <BuySellMainView />
</div>
