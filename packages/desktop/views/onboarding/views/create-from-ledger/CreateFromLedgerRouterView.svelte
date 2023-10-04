<script lang="ts">
    import { Platform } from '@core/app'
    import features from '@features/features'
    import { CreateFromLedgerRoute } from './create-from-ledger-route.enum'
    import { createFromLedgerRoute } from './create-from-ledger-router'
    import { ConnectLedgerView, InstallLedgerView } from './views'

    $: if (features.analytics.onboardingRoute.enabled && $createFromLedgerRoute) {
        Platform.trackEvent('create-from-ledger-route', { route: $createFromLedgerRoute })
    }
</script>

{#if $createFromLedgerRoute === CreateFromLedgerRoute.InstallLedger}
    <InstallLedgerView />
{:else if $createFromLedgerRoute === CreateFromLedgerRoute.ConnectLedger}
    <ConnectLedgerView />
{/if}
