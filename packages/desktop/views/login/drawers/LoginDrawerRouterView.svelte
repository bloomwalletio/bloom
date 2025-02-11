<script lang="ts">
    import { Drawer } from '@components'
    import { DrawerRoute, drawerState } from '@desktop/auxiliary/drawer'
    import { LoginDrawerRoute } from './'
    import { NetworkConfigRouterView } from '../../dashboard/drawers'
</script>

<Drawer onClose={$drawerState?.props?.onClose}>
    <div slot="contents" class="flex flex-col h-full">
        {#if $drawerState?.route === DrawerRoute.Login}
            {#if $drawerState.id === LoginDrawerRoute.NetworkConfig}
                <NetworkConfigRouterView initialRoute={$drawerState.initialSubroute} />
            {/if}
        {/if}
    </div>
</Drawer>
