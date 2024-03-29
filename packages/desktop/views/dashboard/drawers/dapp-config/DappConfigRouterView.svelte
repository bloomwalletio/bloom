<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import {
        ConfirmConnectionDrawer,
        ConnectedDappsDrawer,
        ConnectionRequestDrawer,
        DappDetailsDrawer,
        InputConnectionCodeDrawer,
        EditAccountsDrawer,
        EditNetworksDrawer,
        EditPermissionsDrawer,
    } from './views'
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
        $dappConfigRoute = undefined
        $dappConfigRouter = null
    })
</script>

{#if $dappConfigRoute === DappConfigRoute.ConnectedDapps}
    <ConnectedDappsDrawer drawerRouter={$dappConfigRouter} {...props} />
{:else if $dappConfigRoute === DappConfigRoute.ConfirmConnection}
    <ConfirmConnectionDrawer drawerRouter={$dappConfigRouter} {...props} />
{:else if $dappConfigRoute === DappConfigRoute.InputCode}
    <InputConnectionCodeDrawer drawerRouter={$dappConfigRouter} {...props} />
{:else if $dappConfigRoute === DappConfigRoute.ConnectionRequest}
    <ConnectionRequestDrawer drawerRouter={$dappConfigRouter} {...props} />
{:else if $dappConfigRoute === DappConfigRoute.DappDetails}
    <DappDetailsDrawer drawerRouter={$dappConfigRouter} {...props} />
{:else if $dappConfigRoute === DappConfigRoute.EditAccounts}
    <EditAccountsDrawer drawerRouter={$dappConfigRouter} {...props} />
{:else if $dappConfigRoute === DappConfigRoute.EditNetworks}
    <EditNetworksDrawer drawerRouter={$dappConfigRouter} {...props} />
{:else if $dappConfigRoute === DappConfigRoute.EditPermissions}
    <EditPermissionsDrawer drawerRouter={$dappConfigRouter} {...props} />
{/if}
