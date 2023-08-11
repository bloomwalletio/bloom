<script lang="ts">
    import { onDestroy } from 'svelte'
    import { DappsListDrawer } from './drawers'
    import { DappsDrawerRoute } from './dapps-route.enum'
    import { dappsDrawerRoute, dappsDrawerRouter } from './dapps.router'

    onDestroy(() => {
        $dappsDrawerRouter.reset()
        $dappsDrawerRouter = null
    })
</script>

{#if $dappsDrawerRoute === DappsDrawerRoute.List}
    <DappsListDrawer drawerRouter={$dappsDrawerRouter} />
{/if}
