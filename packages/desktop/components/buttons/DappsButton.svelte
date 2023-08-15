<script lang="ts">
    import { Icon } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { DrawerId, closeDrawer, drawerState, openDrawer } from '@desktop/auxiliary/drawer'
    import { DappsDrawerRouter, dappsDrawerRouter } from '@views/dashboard/drawers/dapps'

    function onDappsClick(): void {
        if ($drawerState.active) {
            closeDrawer()
        } else {
            $dappsDrawerRouter = new DappsDrawerRouter()
            openDrawer({ id: DrawerId.Dapps })
        }
    }
</script>

<connected-dapps-button class="block relative">
    <button
        class="connected-dapps-button hover:bg-gray-300 dark:hover:bg-gray-900 border-gray-400 dark:border-gray-700"
        on:click={onDappsClick}
    >
        <Icon height={20} width={20} icon={IconEnum.Alias} classes="dark:text-white" />
    </button>
</connected-dapps-button>

<style lang="scss">
    .connected-dapps-button {
        @apply flex items-center border border-solid rounded-md text-14;
        @apply p-1;
        -webkit-app-region: none;
    }
</style>
