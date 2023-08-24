<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import { ConnectedDappsDrawer } from './views'
    import { DappConfigRoute } from './dapp-config-route.enum'
    import { DappConfigRouter, dappConfigRoute, dappConfigRouter } from './dapp-config.router'

    onMount(() => {
        $dappConfigRouter = new DappConfigRouter()
    })

    onDestroy(() => {
        $dappConfigRouter = null
    })
</script>

{#if $dappConfigRoute === DappConfigRoute.ConnectedDapps}
    <ConnectedDappsDrawer drawerRouter={$dappConfigRouter} />
{/if}
