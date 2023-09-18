<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import { DappConfigRoute } from './dapp-config-route.enum'
    import { DappConfigRouter, dappConfigRoute, dappConfigRouter } from './dapp-config.router'
    import { ConfirmConnectionDrawer, ConnectedDappsDrawer, InputConnectionCodeDrawer } from './views'

    onMount(() => {
        $dappConfigRouter = new DappConfigRouter()
    })

    onDestroy(() => {
        $dappConfigRouter = null
    })
</script>

{#if $dappConfigRoute === DappConfigRoute.ConnectedDapps}
    <ConnectedDappsDrawer drawerRouter={$dappConfigRouter} />
{:else if $dappConfigRoute === DappConfigRoute.ConfirmConnection}
    <ConfirmConnectionDrawer drawerRouter={$dappConfigRouter} />
{:else if $dappConfigRoute === DappConfigRoute.InputCode}
    <InputConnectionCodeDrawer drawerRouter={$dappConfigRouter} />
{/if}
