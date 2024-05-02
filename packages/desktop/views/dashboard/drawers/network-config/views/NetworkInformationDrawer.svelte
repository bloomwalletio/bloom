<script lang="ts">
    import { selectedNetworkForNetworkDrawer, NetworkNamespace } from '@core/network'
    import { Router } from '@core/router'
    import { NetworkConfigRoute } from '../'
    import { EvmChainInformationDrawer, StardustInformationDrawer } from './components'

    export let drawerRouter: Router<NetworkConfigRoute>
</script>

{#if $selectedNetworkForNetworkDrawer && $selectedNetworkForNetworkDrawer.namespace === NetworkNamespace.Evm}
    <EvmChainInformationDrawer network={$selectedNetworkForNetworkDrawer} {drawerRouter} />
{:else if $selectedNetworkForNetworkDrawer && $selectedNetworkForNetworkDrawer.namespace === NetworkNamespace.Stardust}
    <StardustInformationDrawer network={$selectedNetworkForNetworkDrawer} {drawerRouter} />
{/if}
