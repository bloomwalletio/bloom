<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { CreateFromLedgerRouterView } from '../create-from-ledger'
    import { RestoreFromMnemonicRouterView } from '../restore-from-mnemonic'
    import { RestoreFromStrongholdRouterView } from '../restore-from-stronghold'
    import { RestoreProfileRoute } from './restore-profile-route.enum'
    import { restoreProfileRoute } from './restore-profile-router'
    import { BalanceFinderView, ChooseRestoreProfileFlowView, ClaimFinderView } from './views'

    $: if (features.analytics.onboardingRoute.enabled && $restoreProfileRoute) {
        Platform.trackEvent('restore-profile-route', { route: $restoreProfileRoute })
    }
</script>

{#if $restoreProfileRoute === RestoreProfileRoute.ChooseRestoreProfileFlow}
    <ChooseRestoreProfileFlowView />
{:else if $restoreProfileRoute === RestoreProfileRoute.RestoreFromMnemonic}
    <RestoreFromMnemonicRouterView />
{:else if $restoreProfileRoute === RestoreProfileRoute.RestoreFromStronghold}
    <RestoreFromStrongholdRouterView />
{:else if $restoreProfileRoute === RestoreProfileRoute.RestoreFromLedger}
    <CreateFromLedgerRouterView />
{:else if $restoreProfileRoute === RestoreProfileRoute.BalanceFinder}
    <BalanceFinderView />
{:else if $restoreProfileRoute === RestoreProfileRoute.ClaimFinder}
    <ClaimFinderView />
{/if}
