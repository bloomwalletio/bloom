<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { DashboardDrawerRoute, closeDrawer, drawerState, openDrawer } from '@desktop/auxiliary/drawer'
    import { Icon } from '@ui'
    import { ContactBookRouter, contactBookRouter } from '@views/dashboard/drawers'

    function onContactBookClick(): void {
        if ($drawerState.active && $drawerState.id === DashboardDrawerRoute.ContactBook) {
            closeDrawer()
        } else {
            $contactBookRouter = new ContactBookRouter()
            openDrawer({ id: DashboardDrawerRoute.ContactBook })
        }
    }
</script>

<contact-book-button class="block relative">
    <button
        class="contact-book-button hover:bg-gray-300 dark:hover:bg-gray-900 border-gray-400 dark:border-gray-700"
        on:click={onContactBookClick}
    >
        <Icon height={20} width={20} icon={IconEnum.Profile} classes="dark:text-white" />
    </button>
</contact-book-button>

<style lang="scss">
    .contact-book-button {
        @apply flex items-center border border-solid rounded-md text-14;
        @apply p-1;
        -webkit-app-region: none;
    }
</style>
