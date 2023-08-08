<script lang="ts">
    import { onDestroy } from 'svelte'
    import { ConnectedDappsListDrawer } from './drawers'
    import { ConnectedDappsDrawerRoute } from './connected-dapps-route.enum'
    import { connectedDappsDrawerRoute, connectedDappsDrawerRouter } from './connected-dapps.router'

    onDestroy(() => {
        $connectedDappsDrawerRouter.reset()
        $connectedDappsDrawerRouter = null
    })
</script>

{#if $connectedDappsDrawerRoute === ConnectedDappsDrawerRoute.List}
    <ConnectedDappsListDrawer drawerRouter={$connectedDappsDrawerRouter} />
{/if}
