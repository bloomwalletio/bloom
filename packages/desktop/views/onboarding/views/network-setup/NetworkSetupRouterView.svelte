<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { NetworkSetupRoute } from './network-setup-route.enum'
    import { networkSetupRoute } from './network-setup-router'
    import { ChooseNetworkView, CustomNetworkView, TestnetSelectionView } from './views'

    $: if (features.analytics.onboardingRoute.enabled && $networkSetupRoute) {
        Platform.trackEvent('network-setup-route', { route: $networkSetupRoute })
    }
</script>

{#if $networkSetupRoute === NetworkSetupRoute.ChooseNetwork}
    <ChooseNetworkView />
{:else if $networkSetupRoute === NetworkSetupRoute.TestnetSelection}
    <TestnetSelectionView />
{:else if $networkSetupRoute === NetworkSetupRoute.CustomNetwork}
    <CustomNetworkView />
{/if}
