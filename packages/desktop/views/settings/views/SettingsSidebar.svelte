<script lang="ts">
    import { IconName, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile/stores'
    import { SettingsRoute, settingsRoute, SettingsRouteNoProfile, settingsRouter } from '@core/router'
    import features from '@features/features'
    import { SidebarTab } from '@components'
    import { ISettingsSidebarTab } from '@desktop/routers'

    const SETTINGS_ICON_MAP: { [key in SettingsRoute]: IconName } = {
        [SettingsRoute.General]: IconName.Tool,
        [SettingsRoute.Profile]: IconName.User,
        [SettingsRoute.Collectibles]: IconName.Image,
        [SettingsRoute.Security]: IconName.Locked,
        [SettingsRoute.Advanced]: IconName.SettingsSliders,
        [SettingsRoute.Help]: IconName.LifeBuoy,
    }

    const { loggedIn } = $activeProfile
    const routes = Object.values($loggedIn ? SettingsRoute : SettingsRouteNoProfile)
    const sidebarTabs: ISettingsSidebarTab[] = routes.map((route) => getSidebarTab(route)).filter((tab) => Boolean(tab))

    function getSidebarTab(route: SettingsRoute | SettingsRouteNoProfile): ISettingsSidebarTab | undefined {
        const isSettingEnabled = features?.settings?.[route]?.enabled
        if (isSettingEnabled) {
            const label = localize(`views.settings.${route}.title`)
            return {
                icon: SETTINGS_ICON_MAP[route],
                label,
                route,
                onClick: () => openSettingsRoute(route),
            }
        } else {
            return undefined
        }
    }

    function openSettingsRoute(route: SettingsRoute | SettingsRouteNoProfile): void {
        $settingsRouter.reset()
        $settingsRouter.goTo(route)
    }
</script>

<aside class="flex flex-col w-1/3 h-full justify-start items-start">
    <settings-sidebar-header>
        <Text type="h6" class="mb-7">
            {localize('views.settings.settings')}
        </Text>
    </settings-sidebar-header>
    <settings-sidebar-tabs>
        {#each sidebarTabs as tab}
            <div class="flex">
                <SidebarTab {tab} selected={$settingsRoute === tab.route} />
            </div>
        {/each}
    </settings-sidebar-tabs>
</aside>

<style lang="postcss">
    aside {
        @apply w-64 px-4 py-8;
        @apply bg-surface-1/90 dark:bg-surface-1-dark/60;
        @apply border-solid border-r border-stroke dark:border-stroke-dark;
        border-top-left-radius: 32px;
        border-bottom-left-radius: 32px;
    }

    settings-sidebar-header {
        @apply ml-4;
    }

    settings-sidebar-tabs {
        @apply w-full space-y-1;
        @apply justify-items-start;
    }
</style>
