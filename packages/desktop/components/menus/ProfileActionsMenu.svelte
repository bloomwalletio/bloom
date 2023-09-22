<script lang="ts">
    import { IconName, Menu } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { logout } from '@core/profile/actions'
    import { routerManager } from '@core/router'

    let menu: Menu | undefined = undefined

    function onSettingsClick(): void {
        $routerManager.openSettings()
        menu?.close()
    }

    function onLogoutClick(): void {
        logout()
    }
</script>

<Menu
    bind:this={menu}
    items={[
        {
            icon: IconName.Settings,
            title: localize('views.dashboard.profileMenu.allSettings'),
            onClick: onSettingsClick,
        },
        {
            icon: IconName.Logout,
            title: localize('views.dashboard.profileMenu.logout'),
            onClick: onLogoutClick,
        },
    ]}
>
    <span slot="anchor">
        <slot />
    </span>
</Menu>
