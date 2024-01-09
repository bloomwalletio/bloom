<script lang="ts">
    import { LogoName } from '@auxiliary/logo'
    import { IconButton, IconName } from '@bloomwalletio/ui'
    import { ProfileActionsMenu, SidebarTab } from '@components'
    import { localize } from '@core/i18n'
    import { activeProfile, isSoftwareProfile } from '@core/profile/stores'
    import { DashboardRoute, buySellRouter, collectiblesRouter, dashboardRouter, governanceRouter, settingsRouter } from '@core/router'
    import { IDashboardSidebarTab } from '@desktop/routers'
    import features from '@features/features'
    import { Logo } from '@ui'
    import LedgerStatusTile from './LedgerStatusTile.svelte'
    import StrongholdStatusTile from './StrongholdStatusTile.svelte'
    import { AutoUpdateToast, BackupToast, VersionToast } from './toasts'
    import { dashboardRoute } from '@core/router'
    import { StardustNetworkId } from '@core/network'

    let expanded = true
    function toggleExpand(): void {
        expanded = !expanded
    }

    let sidebarTabs: IDashboardSidebarTab[]
    $: sidebarTabs = [
        {
            icon: IconName.Wallet,
            label: localize('tabs.wallet'),
            route: DashboardRoute.Wallet,
            onClick: openWallet,
        },
        ...(features?.collectibles?.enabled
            ? [
                  {
                      icon: IconName.Image,
                      label: localize('tabs.collectibles'),
                      route: DashboardRoute.Collectibles,
                      onClick: openCollectibles,
                  },
              ]
            : []),
        ...(features?.governance?.enabled
            ? [
                  {
                      icon: IconName.Bank,
                      label: localize('tabs.governance'),
                      route: DashboardRoute.Governance,
                      onClick: openGovernance,
                  },
              ]
            : []),
        ...(features?.developerTools?.enabled && $activeProfile?.isDeveloperProfile
            ? [
                  {
                      icon: IconName.Developer,
                      label: localize('tabs.developer'),
                      route: DashboardRoute.Developer,
                      onClick: openDeveloper,
                  },
              ]
            : []),
        ...(features?.buySell?.enabled && $activeProfile?.network?.id === StardustNetworkId.Iota
            ? [
                  {
                      icon: IconName.CoinSwap,
                      label: localize('tabs.buySell'),
                      route: DashboardRoute.BuySell,
                      onClick: openBuySell,
                  },
              ]
            : []
        )
    ]

    function openWallet(): void {
        resetAllRouters()
    }

    function openCollectibles(): void {
        resetAllRouters()
        $dashboardRouter.goTo(DashboardRoute.Collectibles)
    }

    function openGovernance(): void {
        resetAllRouters()
        $dashboardRouter.goTo(DashboardRoute.Governance)
    }

    function openDeveloper(): void {
        resetAllRouters()
        $dashboardRouter.goTo(DashboardRoute.Developer)
    }

    function openBuySell(): void {
        resetAllRouters()
        $dashboardRouter.goTo(DashboardRoute.BuySell)
    }

    function resetAllRouters(): void {
        $dashboardRouter.reset()
        $collectiblesRouter.reset()
        $settingsRouter.reset()
        $governanceRouter.reset()
        $buySellRouter.reset()
    }
</script>

<aside class:expanded class="flex flex-col justify-between">
    <dashboard-sidebar-header class="flex flex-row justify-between items-center">
        <logo class="flex flex-row flex-none space-x-3">
            <button on:click={toggleExpand} disabled={expanded}>
                <Logo width="32" logo={LogoName.BloomLogo} />
            </button>
            {#if expanded}
                <Logo width="80" logo={LogoName.BloomText} />
            {/if}
        </logo>
        {#if expanded}
            <IconButton icon={IconName.Collapse} textColor="secondary" on:click={toggleExpand} />
        {/if}
    </dashboard-sidebar-header>
    <dashboard-sidebar-content class="flex flex-col flex-grow justify-between">
        <dashboard-sidebar-tabs class="flex flex-col">
            {#each sidebarTabs as tab}
                <div class="flex">
                    <SidebarTab {tab} {expanded} selected={$dashboardRoute === tab.route} />
                </div>
            {/each}
        </dashboard-sidebar-tabs>

        {#if expanded}
            <dashboard-sidebar-tiles class="w-full flex flex-col space-y-2">
                {#if false}
                    <!-- TODO: logic of when to display toast one at a time -->
                    <AutoUpdateToast />
                    <BackupToast />
                {/if}
                <VersionToast />
                {#if $isSoftwareProfile}
                    <StrongholdStatusTile />
                {:else}
                    <LedgerStatusTile />
                {/if}
            </dashboard-sidebar-tiles>
        {/if}
    </dashboard-sidebar-content>
    <dashboard-sidebar-footer>
        <ProfileActionsMenu {expanded} />
    </dashboard-sidebar-footer>
</aside>

<style lang="postcss">
    aside {
        @apply h-screen w-20;
        @apply bg-surface-1/90 dark:bg-surface-1-dark/60;
        @apply border-solid border-r border-stroke dark:border-stroke-dark;

        &.expanded {
            @apply w-64;
        }
    }

    dashboard-sidebar-header {
        @apply gap-8;
        @apply py-4.5 px-6;
        @apply border-b border-solid border-stroke dark:border-stroke-dark;
    }

    dashboard-sidebar-content {
        @apply p-4 pb-2;
    }

    dashboard-sidebar-tabs {
        @apply justify-items-start;
        @apply w-full space-y-1;
    }

    dashboard-sidebar-footer {
        @apply w-full h-16 justify-center items-center;
        @apply border-t border-solid border-stroke dark:border-stroke-dark;
    }
</style>
