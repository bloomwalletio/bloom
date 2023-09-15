<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { CreateFromLedgerRouterView } from '../create-from-ledger'
    import { CreateFromMnemonicRouterView } from '../create-from-mnemonic'
    import { CreateProfileRoute } from './create-profile-route.enum'
    import { createProfileRoute, createProfileRouter } from './create-profile-router'
    import { ChooseCreateProfileFlowView } from './views'

    $: if (features.analytics.onboardingRoute.enabled && $createProfileRoute) {
        Platform.trackEvent('create-profile-route', { route: $createProfileRoute })
    }
</script>

{#if $createProfileRoute === CreateProfileRoute.ChooseCreateProfileFlow}
    <ChooseCreateProfileFlowView />
{:else if $createProfileRoute === CreateProfileRoute.CreateFromMnemonic}
    <CreateFromMnemonicRouterView />
{:else if $createProfileRoute === CreateProfileRoute.CreateFromLedger}
    <CreateFromLedgerRouterView router={$createProfileRouter} />
{/if}
