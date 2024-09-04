<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import { Router } from '@core/router'
    import { NetworkConfigRoute, networkConfigRoute, NetworkConfigRouter, networkConfigRouter } from '../'
    import {
        AddCustomNetworkDrawer,
        AddNetworkDrawer,
        NetworkDepositAddressDrawer,
        NetworkInformationDrawer,
        ConfirmLedgerEvmAddressDrawer,
        ConnectedNetworksDrawer,
        EditNetworkDrawer,
        RemoveNetworkDrawer,
    } from './views'
    import { clearSelectedNetworkForNetworkDrawer } from '@core/network'
    import features from '@features/features'
    import { Platform } from '@core/app'

    export let initialRoute: NetworkConfigRoute | undefined = undefined

    let drawerRouter: Router<NetworkConfigRoute>

    $: if (features.analytics.drawerRoute.networkConfig.enabled && $networkConfigRoute) {
        Platform.trackEvent('network-config-route', { route: $networkConfigRoute })
    }

    onMount(() => {
        $networkConfigRouter = new NetworkConfigRouter(initialRoute)
        drawerRouter = $networkConfigRouter
    })

    onDestroy(() => {
        $networkConfigRouter = null
        clearSelectedNetworkForNetworkDrawer()
    })
</script>

{#if $networkConfigRoute === NetworkConfigRoute.ConnectedChains}
    <ConnectedNetworksDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.ChainInformation}
    <NetworkInformationDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.EditChain}
    <EditNetworkDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.RemoveChain}
    <RemoveNetworkDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.ChainDepositAddress}
    <NetworkDepositAddressDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.ConfirmLedgerEvmAddress}
    <ConfirmLedgerEvmAddressDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.AddChain}
    <AddNetworkDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.AddCustomChain}
    <AddCustomNetworkDrawer {drawerRouter} />
{/if}
