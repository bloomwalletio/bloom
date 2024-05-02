<script lang="ts">
    import { selectedNetwork, NetworkNamespace } from '@core/network'
    import { Router } from '@core/router'
    import { NetworkConfigRoute } from '../'
    import { EvmChainInformationDrawer, StardustInformationDrawer } from './components'

    export let drawerRouter: Router<NetworkConfigRoute>
</script>

{#if $selectedNetwork && $selectedNetwork.namespace === NetworkNamespace.Evm}
    <EvmChainInformationDrawer network={$selectedNetwork} {drawerRouter} />
{:else if $selectedNetwork && $selectedNetwork.namespace === NetworkNamespace.Stardust}
    <StardustInformationDrawer network={$selectedNetwork} {drawerRouter} />
{/if}
