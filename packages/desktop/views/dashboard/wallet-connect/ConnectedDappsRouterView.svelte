<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import { ConnectedDappsDrawer } from './drawers'
    import { ConnectedDappsDrawerRoute } from './connected-dapps-route.enum'
    import {
        connectedDappsDrawerRoute,
        ConnectedDappsDrawerRouter,
        connectedDappsDrawerRouter,
    } from './connected-dapps.router'

    onMount(() => {
        $connectedDappsDrawerRouter = new ConnectedDappsDrawerRouter(ConnectedDappsDrawerRoute.List)
    })

    onDestroy(() => {
        $connectedDappsDrawerRouter.reset()
        $connectedDappsDrawerRouter = null
    })
</script>

{#if $connectedDappsDrawerRoute === ConnectedDappsDrawerRoute.List}
    <ConnectedDappsDrawer drawerRouter={$connectedDappsDrawerRouter} />
{/if}
