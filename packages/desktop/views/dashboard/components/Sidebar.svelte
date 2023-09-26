<script lang="ts">
    import { IconName, IconButton } from '@bloomwalletio/ui'
    import { SidebarTab } from '@components'
    import { localize } from '@core/i18n'
    import { isSoftwareProfile, activeProfile } from '@core/profile/stores'
    import { DashboardRoute, collectiblesRouter, dashboardRouter, governanceRouter, settingsRouter } from '@core/router'
    import { ISidebarTab } from '@desktop/routers'
    import features from '@features/features'
    import { Logo } from '@ui'
    import { BackupToast, VersionToast, AutoUpdateToast } from './toasts'
    import StrongholdStatusTile from './StrongholdStatusTile.svelte'
    import LedgerStatusTile from './LedgerStatusTile.svelte'
    import ProfileFrame from './ProfileFrame.svelte'
    import { LogoName } from '@auxiliary/logo'

    let collapsed: boolean = false
    function toggleCollapse(): void {
        collapsed = !collapsed
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

<aside class:collapsed>
    <logo-container class="flex flex-row;">
        <logo class="flex flex-row flex-none space-x-4">
            <button on:click={toggleCollapse} disabled={!collapsed}>
                <Logo width="32" logo={LogoName.BloomLogo} />
            </button>
            {#if !collapsed}
                <Logo width="80" logo={LogoName.BloomText} />
            {/if}
        </logo>
        {#if !collapsed}
            <IconButton icon={IconName.Collapse} textColor="secondary" on:click={toggleCollapse} />
        {/if}
    </logo-container>

    <sidebar-tabs class="flex flex-col">
        {#each sidebarTabs as tab}
            <div class="flex">
                <SidebarTab {tab} {collapsed} />
            </div>
        {/each}
    </sidebar-tabs>

    {#if !collapsed}
        <toasts>
            <VersionToast />
            <AutoUpdateToast />
            <BackupToast />
        </toasts>

        <status-container>
            {#if $isSoftwareProfile}
                <StrongholdStatusTile />
            {:else}
                <LedgerStatusTile />
            {/if}
        </status-container>
    {/if}
    <ProfileFrame {collapsed} />
</aside>

<style lang="postcss">
    aside {
        @apply h-screen w-64;
        @apply flex flex-col;
        @apply relative;
        @apply bg-surface-1/90 dark:bg-surface-1-dark/60;
        @apply border-solid border-r border-stroke dark:border-stroke-dark;

        &.collapsed {
            @apply w-20;
        }
    }

    logo-container {
        @apply justify-between items-center;
        @apply gap-8;
        @apply py-4.5 px-6;
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
