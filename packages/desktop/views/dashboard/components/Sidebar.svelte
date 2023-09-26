<script lang="ts">
    import { Icon, IconName } from '@bloomwalletio/ui'
    import { SidebarTab } from '@components'
    import { localize } from '@core/i18n'
    import { isSoftwareProfile, activeProfile } from '@core/profile/stores'
    import { DashboardRoute, collectiblesRouter, dashboardRouter, governanceRouter, settingsRouter } from '@core/router'
    import { ISidebarTab } from '@desktop/routers'
    import features from '@features/features'
    import { Logo } from '@ui'
    import { BackupToast, VersionToast, AutoUpdateToast } from './toasts'
    import StrongholdStatusTile from './StrongholdStatusTile.svelte'
    import ProfileFrame from './ProfileFrame.svelte'

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
                      icon: IconName.Brush,
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

<aside class="">
    <logo-container class="flex flex-row;">
        <Logo width="120" logo="bloom" />
        <Icon name={IconName.Collapse} color="gray" />
    </logo-container>

    <sidebar-tabs class="flex flex-col">
        {#each sidebarTabs as tab}
            <div class="flex">
                <SidebarTab {tab} />
            </div>
        {/each}
    </sidebar-tabs>

    <toasts>
        <VersionToast />
        <AutoUpdateToast />
        <BackupToast />
    </toasts>

    <status-container>
        {#if $isSoftwareProfile}
            <StrongholdStatusTile />
        {/if}
    </status-container>
    <ProfileFrame />
</aside>

<style lang="postcss">
    aside {
        @apply h-screen w-64;
        @apply flex flex-col;
        @apply relative;
        @apply bg-surface-1 dark:bg-surface-1-dark;
        @apply border-solid border-r border-stroke dark:border-stroke-dark;
    }

    logo-container {
        @apply justify-between items-center;
        @apply gap-8;
        @apply py-4.5 px-7;
        @apply border-b border-solid border-stroke dark:border-stroke-dark;
    }

    sidebar-tabs {
        @apply justify-items-start;
        @apply w-full space-y-1;
        @apply p-4 pb-2;
    }

    status-container {
        @apply p-4 pt-0;
    }

    toasts {
        @apply flex flex-col-reverse;
        @apply overflow-auto;
        @apply flex-grow;
        @apply px-4 py-2 gap-2;
    }

    :global(body.platform-win32) aside {
        @apply -top-0;
        @apply pt-10;
    }
</style>
