<script lang="ts">
    import { selectedChain, NetworkNamespace } from '@core/network'
    import { Router } from '@core/router'
    import { NetworkConfigRoute } from '../'
    import { EvmChainInformationDrawer, StardustInformationDrawer } from './components'

    export let drawerRouter: Router<NetworkConfigRoute>
</script>

{#if $selectedChain && $selectedChain.namespace === NetworkNamespace.Evm}
    <EvmChainInformationDrawer network={$selectedChain} {drawerRouter} />
{:else if $selectedChain && $selectedChain.namespace === NetworkNamespace.Stardust}
    <StardustInformationDrawer network={$selectedChain} {drawerRouter} />
{/if}
