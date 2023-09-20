<script lang="ts">
    import { Icon, IconName, Indicator } from '@bloomwalletio/ui'
    import { ProfileActionsModal, SidebarTab } from '@components'
    import { appVersionDetails } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile/stores'
    import { DashboardRoute, collectiblesRouter, dashboardRouter, governanceRouter, settingsRouter } from '@core/router'
    import { isRecentDate } from '@core/utils'
    import { ISidebarTab } from '@desktop/routers'
    import features from '@features/features'
    import { Logo, Modal, ProfileAvatar } from '@ui'
    import { default as StrongholdStatusTile } from './StrongholdStatusTile.svelte'

    let profileModal: Modal

    const { shouldOpenProfileModal } = $activeProfile

    $: lastStrongholdBackupTime = $activeProfile?.lastStrongholdBackupTime
    $: lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
    $: isBackupSafe = lastBackupDate && isRecentDate(lastBackupDate)?.lessThanThreeMonths

    let sidebarTabs: ISidebarTab[]
    $: sidebarTabs = [
        ...(features?.wallet?.enabled
            ? [
                  {
                      icon: IconName.Wallet,
                      label: localize('tabs.wallet'),
                      route: DashboardRoute.Wallet,
                      onClick: openWallet,
                  },
              ]
            : []),
        ...(features?.wallet?.newDashboard?.enabled
            ? [
                  {
                      icon: IconName.Wallet,
                      label: localize('tabs.wallet'),
                      route: DashboardRoute.NewDashboard,
                      onClick: openNewDashboard,
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

    function openNewDashboard(): void {
        resetAllRouters()
        $dashboardRouter.goTo(DashboardRoute.NewDashboard)
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

<aside class="flex flex-col relative">
    <nav class="flex flex-col w-full h-full">
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
    </nav>
    <div>
        <div class="p-4">
            <StrongholdStatusTile />
        </div>
        <button class="flex items-center justify-end rounded-full" on:click={profileModal?.open}>
            <div class="relative">
                <ProfileAvatar profile={$activeProfile} />
                {#if !$shouldOpenProfileModal && (!isBackupSafe || !$appVersionDetails.upToDate)}
                    <Indicator size="sm" color="red" border="white" class="absolute top-0 right-0" />
                {/if}
            </div>
        </button>
        <ProfileActionsModal bind:modal={profileModal} />
    </div>
</aside>

<style lang="postcss">
    aside {
        @apply bg-white dark:bg-gray-800;
        @apply h-full w-64;
        @apply border-solid border-r border-gray-100 dark:border-gray-800;
    }

    logo-container {
        @apply justify-between items-center;
        @apply gap-8;
        @apply py-4.5 px-7;
    }

    sidebar-tabs {
        @apply justify-items-start;
        @apply w-full space-y-1;
        @apply p-4;
    }

    button {
        @apply px-7 py-4;
    }

    :global(body.platform-win32) aside {
        @apply -top-0;
        @apply pt-10;
    }
</style>
