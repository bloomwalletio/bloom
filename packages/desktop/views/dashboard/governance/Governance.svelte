<script lang="ts">
    import features from '@features/features'
    import { GovernanceDashboardView, ProposalDetailsView } from './views'
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { GovernanceRoute, governanceRoute, governanceRouter } from '@core/router'
    import { Platform } from '@core/app'

    $: $selectedAccountIndex !== undefined && $governanceRouter.reset()

    $: if (features.analytics.dashboardRoute.governance.enabled && $governanceRoute) {
        Platform.trackEvent('governance-route', { route: $governanceRoute })
    }
</script>

{#if $selectedAccount}
    {#if $governanceRoute === GovernanceRoute.Proposals}
        <GovernanceDashboardView />
    {:else if $governanceRoute === GovernanceRoute.Details}
        <ProposalDetailsView />
    {/if}
{/if}
