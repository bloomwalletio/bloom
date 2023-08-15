<script lang="ts">
    import { Icon } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { DashboardDrawerRoute, closeDrawer, drawerState, openDrawer } from '@desktop/auxiliary/drawer'
    import { DappConfigRouter, dappConfigRouter } from '@views/dashboard/drawers/dapp-config'

    function onDappsClick(): void {
        if ($drawerState.active && $drawerState.id === DashboardDrawerRoute.DappConfig) {
            closeDrawer()
        } else {
            $dappConfigRouter = new DappConfigRouter()
            openDrawer({ id: DashboardDrawerRoute.DappConfig })
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
