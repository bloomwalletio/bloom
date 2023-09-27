<script lang="ts">
    import { IconName, Menu, Text } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { logout } from '@core/profile/actions'
    import { activeProfile } from '@core/profile/stores'
    import { routerManager } from '@core/router'
    import { ProfileAvatar } from '@ui'

    export let expanded = true
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
    placement="top-end"
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
    <profile-menu class:expanded slot="anchor">
        {#if expanded}
            <Text>{$activeProfile.name}</Text>
        {/if}
        <ProfileAvatar profile={$activeProfile} size="sm" />
    </profile-menu>
</Menu>

<style lang="postcss">
    profile-menu {
        @apply flex flex-row justify-center items-center;
        @apply w-full h-16;
        @apply px-0 py-2;
        @apply hover:bg-surface-2 dark:hover:bg-surface-2-dark;

        &.expanded {
            @apply justify-between px-7;
        }
    }
</style>
