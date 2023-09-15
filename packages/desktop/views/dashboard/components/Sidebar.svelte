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

<aside
    class="flex flex-col justify-center items-center bg-white dark:bg-gray-800 h-full relative w-20 px-5 pt-10 pb-5 border-solid border-r border-gray-100 dark:border-gray-800"
>
    <nav class="flex flex-grow flex-col items-center justify-between">
        <logo-container>
            <Logo width="120" logo="logo-bloom-full" />
            <Icon name={IconName.Collapse} color="gray" />
        </logo-container>
        <div class="flex flex-col flex-auto items-center justify-center mb-7 space-y-8">
            {#each sidebarTabs as tab}
                <div class="flex">
                    <SidebarTab {tab} />
                </div>
            {/each}
        </div>
        <div class="flex flex-col items-center">
            <button class="relative flex items-center justify-center rounded-full" on:click={profileModal?.open}>
                <ProfileAvatar profile={$activeProfile} />
                {#if !$shouldOpenProfileModal && (!isBackupSafe || !$appVersionDetails.upToDate)}
                    <Indicator size="sm" color="red" border="white" class="absolute top-1 right-0" />
                {/if}
            </button>
        </div>
    </nav>
    <ProfileActionsModal bind:modal={profileModal} />
</aside>

<style lang="postcss">
    /* aside {
        @apply flex flex-col justify-center items-center;
        @apply bg-white dark:bg-gray-800 relative;
        @apply border-solid border-r border-gray-100 dark:border-gray-800;
        @apply px-5 pt-5 pb-5;
        @apply w-64;
    } */

    logo-container {
        @apply flex flex-row;
        @apply items-center;
        @apply gap-8;
    }

    :global(body.platform-win32) aside {
        @apply -top-0;
        @apply pt-10;
    }
</style>
