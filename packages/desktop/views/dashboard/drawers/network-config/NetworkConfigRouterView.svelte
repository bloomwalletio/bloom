<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import { Router } from '@core/router'
    import { NetworkConfigRoute, networkConfigRoute, NetworkConfigRouter, networkConfigRouter } from '../'
    import {
        AddChainDrawer,
        ChainDepositAddressDrawer,
        ChainInformationDrawer,
        ConfirmLedgerEvmAddressDrawer,
        ConnectedChainsDrawer,
        EditChainDrawer,
        NetworkSettingsDrawer,
        RemoveChainDrawer,
    } from './views'
    import { clearSelectedChain } from '@core/network'
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
        clearSelectedChain()
    })
</script>

{#if $networkConfigRoute === NetworkConfigRoute.ConnectedChains}
    <ConnectedChainsDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.ChainInformation}
    <ChainInformationDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.NetworkSettings}
    <NetworkSettingsDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.EditChain}
    <EditChainDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.RemoveChain}
    <RemoveChainDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.ChainDepositAddress}
    <ChainDepositAddressDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.ConfirmLedgerEvmAddress}
    <ConfirmLedgerEvmAddressDrawer {drawerRouter} />
{:else if $networkConfigRoute === NetworkConfigRoute.AddChain}
    <AddChainDrawer {drawerRouter} />
{/if}
