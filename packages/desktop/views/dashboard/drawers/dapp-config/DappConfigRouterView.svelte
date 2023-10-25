<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import { ConfirmConnectionDrawer, ConnectedDappsDrawer, InputConnectionCodeDrawer } from './views'
    import { DappConfigRoute } from './dapp-config-route.enum'
    import { DappConfigRouter, dappConfigRoute, dappConfigRouter } from './dapp-config.router'
    import features from '@features/features'
    import { Platform } from '@core/app'

    export let initialRoute: DappConfigRoute | undefined = undefined
    export let props = undefined

    $: if (features.analytics.drawerRoute.dappConfig.enabled && $dappConfigRoute) {
        Platform.trackEvent('dapp-config-route', { route: $dappConfigRoute })
    }

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
