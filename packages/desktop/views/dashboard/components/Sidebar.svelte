<script lang="ts">
    import { LogoName } from '@auxiliary/logo'
    import { IconButton, IconName } from '@bloomwalletio/ui'
    import { ProfileActionsMenu, SidebarTab } from '@components'
    import { localize } from '@core/i18n'
    import { activeProfile, isSoftwareProfile } from '@core/profile/stores'
    import { DashboardRoute, collectiblesRouter, dashboardRouter, governanceRouter, settingsRouter } from '@core/router'
    import { ISidebarTab } from '@desktop/routers'
    import features from '@features/features'
    import { Logo } from '@ui'
    import LedgerStatusTile from './LedgerStatusTile.svelte'
    import StrongholdStatusTile from './StrongholdStatusTile.svelte'
    import { AutoUpdateToast, BackupToast, VersionToast } from './toasts'

    let expanded = true
    function toggleExpand(): void {
        expanded = !expanded
    }

    let sidebarTabs: ISidebarTab[]
    $: sidebarTabs = [
        ...(features?.wallet?.newDashboard?.enabled
            ? [
                  {
                      icon: IconName.Wallet,
                      label: localize('tabs.wallet'),
                      route: DashboardRoute.Wallet,
                      onClick: openWallet,
                  },
              ]
            : []),
        ...(features?.wallet?.oldDashboard.enabled
            ? [
                  {
                      icon: IconName.Wallet,
                      label: localize('tabs.wallet'),
                      route: DashboardRoute.OldDashboard,
                      onClick: openOldDashboard,
                  },
              ]
            : []),
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
    ]

    function openWallet(): void {
        resetAllRouters()
    }

    function openOldDashboard(): void {
        resetAllRouters()
        $dashboardRouter.goTo(DashboardRoute.OldDashboard)
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

    function resetAllRouters(): void {
        $dashboardRouter.reset()
        $collectiblesRouter.reset()
        $settingsRouter.reset()
        $governanceRouter.reset()
    }
</script>

<aside class:expanded class="flex flex-col justify-between">
    <sidebar-header class="flex flex-row justify-between items-center">
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
    </sidebar-header>
    <sidebar-content class="flex flex-col flex-grow justify-between">
        <sidebar-tabs class="flex flex-col">
            {#each sidebarTabs as tab}
                <div class="flex">
                    <SidebarTab {tab} {expanded} />
                </div>
            {/each}
        </sidebar-tabs>

        {#if expanded}
            <sidebar-tiles class="w-full flex flex-col space-y-2">
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
            </sidebar-tiles>
        {/if}
    </sidebar-content>
    <sidebar-footer>
        <ProfileActionsMenu {expanded} />
    </sidebar-footer>
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

    sidebar-header {
        @apply gap-8;
        @apply py-4.5 px-6;
        @apply border-b border-solid border-stroke dark:border-stroke-dark;
    }

    sidebar-content {
        @apply p-4 pb-2;
    }

    sidebar-tabs {
        @apply justify-items-start;
        @apply w-full space-y-1;
    }

    sidebar-footer {
        @apply w-full h-16 justify-center items-center;
        @apply border-t border-solid border-stroke dark:border-stroke-dark;
    }

    :global(body.platform-win32) aside {
        @apply -top-0;
        @apply pt-10;
    }
</style>
