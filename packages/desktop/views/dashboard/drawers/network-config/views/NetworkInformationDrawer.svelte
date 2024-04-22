<script lang="ts">
    import { DrawerTemplate } from '@components'
    import { EvmNetworkType, IscChain, selectedChain } from '@core/network'
    import { Router } from '@core/router'
    import { NetworkConfigRoute } from '../'
    import { EvmChainInformation, IscChainInformation } from './components'

    export let drawerRouter: Router<NetworkConfigRoute>

    $: evmNetwork = $selectedChain as IscChain
</script>

<DrawerTemplate title={evmNetwork?.name} {drawerRouter}>
    <div class="w-full h-full px-6">
        {#if evmNetwork?.type === EvmNetworkType.Isc}
            <IscChainInformation {evmNetwork} />
        {:else if evmNetwork?.type === EvmNetworkType.PureEvm}
            <EvmChainInformation />
        {/if}
    </div>
</DrawerTemplate>
