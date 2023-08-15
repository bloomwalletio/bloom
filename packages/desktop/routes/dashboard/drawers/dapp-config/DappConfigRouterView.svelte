<script lang="ts">
    import { onDestroy } from 'svelte'
    import { ConnectedDappsDrawer } from './views'
    import { DappConfigRoute } from './dapp-config-route.enum'
    import { dappConfigRoute, dappConfigRouter } from './dapp-config.router'

    onDestroy(() => {
        $dappConfigRouter.reset()
        $dappConfigRouter = null
    })
</script>

{#if $dappConfigRoute === DappConfigRoute.ConnectedDapps}
    <ConnectedDappsDrawer drawerRouter={$dappConfigRouter} />
{/if}
