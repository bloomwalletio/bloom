<script lang="ts">
    import { Breadcrumb, Icon, IconButton, IconName } from '@bloomwalletio/ui'
    import { AccountSwitcher } from '@components'
    import { localize } from '@core/i18n'
    import {
        CollectiblesRoute,
        DashboardRoute,
        GovernanceRoute,
        collectiblesRoute,
        collectiblesRouter,
        dashboardRoute,
        governanceRoute,
        governanceRouter,
    } from '@core/router'
    import { closeDrawer } from '@desktop/auxiliary/drawer'

    let enableBack = false

    $: {
        if ($collectiblesRoute || $governanceRoute) {
            enableBack = isCorrectRoute()
        }
    }

    function isCorrectRoute(): boolean {
        switch ($dashboardRoute) {
            case DashboardRoute.Collectibles:
                return $collectiblesRoute !== CollectiblesRoute.Gallery
            case DashboardRoute.Governance:
                return $governanceRoute !== GovernanceRoute.Proposals
            default:
                break
        }
    }

    function onBackClick(): void {
        closeDrawer()
        switch ($dashboardRoute) {
            case DashboardRoute.Collectibles:
                $collectiblesRouter.previous()
                break
            case DashboardRoute.Governance:
                $governanceRouter.previous()
                break
            default:
                break
        }
    }
</script>

<div class="flex flex-row space-x-0.5 items-center">
    <IconButton
        on:click={onBackClick}
        icon={IconName.ArrowLeft}
        tooltip={localize('actions.back')}
        disabled={!enableBack}
        textColor={'primary'}
        size="sm"
    />
    <div class="flex flex-row space-x-1 items-center">
        <AccountSwitcher navbar />
        <Icon name={IconName.ChevronRight} size="sm" />
        <Breadcrumb
            on:click={onBackClick}
            text={localize(`tabs.${$dashboardRoute}`)}
            disabled={$dashboardRoute === DashboardRoute.Wallet ||
                $dashboardRoute === DashboardRoute.Settings ||
                $dashboardRoute === DashboardRoute.Developer ||
                ($dashboardRoute === DashboardRoute.Collectibles && $collectiblesRoute === CollectiblesRoute.Gallery) ||
                ($dashboardRoute === DashboardRoute.Governance && $governanceRoute === GovernanceRoute.Proposals)}
        />
        {#if $dashboardRoute === DashboardRoute.Collectibles && $collectiblesRoute !== CollectiblesRoute.Gallery}
            <Icon name={IconName.ChevronRight} size="sm" />
            <Breadcrumb text={$collectiblesRouter.getBreadcrumb() ?? $collectiblesRoute} disabled />
        {/if}
        {#if $dashboardRoute === DashboardRoute.Governance && $governanceRoute !== GovernanceRoute.Proposals}
            <Icon name={IconName.ChevronRight} size="sm" />
            <Breadcrumb text={$governanceRouter.getBreadcrumb() ?? $governanceRoute} disabled />
        {/if}
    </div>
</div>
