<script lang="ts">
    import { Drawer } from '@components'
    import { DrawerRoute, drawerState } from '@desktop/auxiliary/drawer'
    import { ContactBookRouterView, DappConfigRouterView, NetworkConfigRouterView } from '.'
    import { DashboardDrawerRoute } from './'
</script>

{#if $drawerState.route === DrawerRoute.Dashboard}
    <Drawer>
        <div slot="contents" class="flex flex-col h-full">
            {#if $drawerState.id === DashboardDrawerRoute.NetworkConfig}
                <NetworkConfigRouterView />
            {:else if $drawerState.id === DashboardDrawerRoute.DappConfig}
                <DappConfigRouterView />
            {:else if $drawerState.id === DashboardDrawerRoute.ContactBook}
                <ContactBookRouterView />
            {/if}
        </div>
    </Drawer>
{/if}
