<script lang="ts">
    import { Drawer } from '@components'
    import { DrawerRoute, drawerState } from '@desktop/auxiliary/drawer'
    import { ContactBookRouterView, DappConfigRouterView, NetworkConfigRouterView } from '.'
    import { DashboardDrawerRoute } from './'
</script>

<Drawer onClose={$drawerState?.props?.onClose}>
    <div slot="contents" class="flex flex-col h-full">
        {#if $drawerState?.route === DrawerRoute.Dashboard}
            {#if $drawerState.id === DashboardDrawerRoute.NetworkConfig}
                <NetworkConfigRouterView initialRoute={$drawerState.initialSubroute} />
            {:else if $drawerState.id === DashboardDrawerRoute.DappConfig}
                <DappConfigRouterView initialRoute={$drawerState.initialSubroute} props={$drawerState.props} />
            {:else if $drawerState.id === DashboardDrawerRoute.ContactBook}
                <ContactBookRouterView />
            {/if}
        {/if}
    </div>
</Drawer>
