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

<aside class="flex flex-col relative" class:collapsed>
    <nav class="flex flex-col w-full h-full">
        <logo-container class="flex flex-row">
            <logo class="flex flex-row space-x-4">
                <button on:click={toggleCollapse} disabled={!collapsed}>
                    <Logo width="32" logo={LogoName.BloomLogo} />
                </button>
                {#if !collapsed}
                    <Logo width="80" logo={LogoName.BloomText} />
                {/if}
            </logo>
            {#if !collapsed}
                <IconButton icon={IconName.Collapse} color="gray" on:click={toggleCollapse} />
            {/if}
        </logo-container>
        <sidebar-tabs class="flex flex-col">
            {#each sidebarTabs as tab}
                <div class="flex">
                    <SidebarTab {tab} {collapsed} />
                </div>
            {/each}
        </sidebar-tabs>
    </nav>

    <div>
        {#if !collapsed}
            <sidebar-middle>
                <toasts>
                    <BackupToast />
                    <AutoUpdateToast />
                    <VersionToast />
                </toasts>
                {#if $isSoftwareProfile}
                    <StrongholdStatusTile />
                {:else}
                    <LedgerStatusTile />
                {/if}
            </sidebar-middle>
        {/if}
        <ProfileFrame {collapsed} />
    </div>
</aside>

<style lang="postcss">
    aside {
        @apply bg-white dark:bg-gray-800;
        @apply h-full w-64;
        @apply border-solid border-r border-gray-100 dark:border-gray-800;

        &.collapsed {
            @apply w-20;
        }
    }

    logo-container {
        @apply justify-between items-center;
        @apply gap-8;
        @apply py-4.5 px-7;
        /* TODO: remove the hardcoded color when color system is in place */
        border-bottom: 1px solid #f1eef9;
    }

    sidebar-tabs {
        @apply justify-items-start;
        @apply w-full space-y-1;
        @apply p-4;
    }

    sidebar-middle {
        @apply flex flex-col;
        @apply p-4 gap-2;
    }

    toasts {
        @apply flex flex-col;
        @apply gap-2;
    }

    :global(body.platform-win32) aside {
        @apply -top-0;
        @apply pt-10;
    }
</style>
