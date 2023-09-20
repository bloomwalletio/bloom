<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import { ConfirmConnectionDrawer, ConnectedDappsDrawer, InputConnectionCodeDrawer } from './views'
    import { DappConfigRoute } from './dapp-config-route.enum'
    import { DappConfigRouter, dappConfigRoute, dappConfigRouter } from './dapp-config.router'

    export let initialRoute = undefined
    export let props = undefined

    onMount(() => {
        $dappConfigRouter = new DappConfigRouter(initialRoute)
    })

    onDestroy(() => {
        $dappConfigRouter = null
    })
</script>

{#if $dappConfigRoute === DappConfigRoute.ConnectedDapps}
    <ConnectedDappsDrawer drawerRouter={$dappConfigRouter} {...props} />
{:else if $dappConfigRoute === DappConfigRoute.ConfirmConnection}
    <ConfirmConnectionDrawer drawerRouter={$dappConfigRouter} {...props} />
{:else if $dappConfigRoute === DappConfigRoute.InputCode}
    <InputConnectionCodeDrawer drawerRouter={$dappConfigRouter} {...props} />
{/if}
