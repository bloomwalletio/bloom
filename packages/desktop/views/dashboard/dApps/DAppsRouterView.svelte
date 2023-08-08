<script lang="ts">
    import { onDestroy } from 'svelte'
    import { DAppsListDrawer } from './drawers'
    import { DAppsDrawerRoute } from './dapps-route.enum'
    import { dAppsDrawerRoute, dAppsDrawerRouter } from './dapps.router'

    onDestroy(() => {
        $dAppsDrawerRouter.reset()
        $dAppsDrawerRouter = null
    })
</script>

{#if $dAppsDrawerRoute === DAppsDrawerRoute.List}
    <DAppsListDrawer drawerRouter={$dAppsDrawerRouter} />
{/if}
