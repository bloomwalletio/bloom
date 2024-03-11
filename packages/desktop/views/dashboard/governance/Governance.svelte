<script lang="ts">
    import features from '@features/features'
    import { GovernanceDashboardView, ProposalDetailsView } from './views'
    import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
    import { GovernanceRoute, governanceRoute, governanceRouter } from '@core/router'
    import { Platform } from '@core/app'
    import { selectedProposal } from '@contexts/governance'

    $: $selectedAccountIndex !== undefined && $governanceRouter.reset()

    $: if (features.analytics.dashboardRoute.governance.enabled && $governanceRoute) {
        Platform.trackEvent('governance-route', { route: $governanceRoute })
    }
</script>

<div class="w-full h-full flex flex-col flex-nowrap p-8 relative flex-1">
    {#if $selectedAccount}
        {#if $governanceRoute === GovernanceRoute.Proposals}
            <GovernanceDashboardView />
        {:else if $governanceRoute === GovernanceRoute.Details && $selectedProposal}
            <ProposalDetailsView />
        {/if}
    {/if}
</div>
