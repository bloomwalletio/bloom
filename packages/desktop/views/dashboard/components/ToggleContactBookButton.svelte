<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { toggleDashboardDrawer } from '@desktop/auxiliary/drawer'
    import { Icon } from '@ui'
    import { DashboardDrawerRoute } from '../drawers'

    function onContactBookClick(): void {
        toggleDashboardDrawer({ id: DashboardDrawerRoute.ContactBook })
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
