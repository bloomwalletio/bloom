<script lang="ts">
    import { DrawerTemplate } from '@components'
    import { EvmNetworkType, IscpChain, selectedChain } from '@core/network'
    import { Router } from '@core/router'
    import { NetworkConfigRoute } from '../'
    import { EvmChainInformation, IscpChainInformation } from './components'

    export let drawerRouter: Router<NetworkConfigRoute>

    $: evmNetwork = $selectedChain as IscpChain
</script>

<DrawerTemplate title={evmNetwork?.name} {drawerRouter}>
    <div class="w-full h-full px-6">
        {#if evmNetwork?.type === EvmNetworkType.Iscp}
            <IscpChainInformation {evmNetwork} />
        {:else if evmNetwork?.type === EvmNetworkType.PureEvm}
            <EvmChainInformation />
        {/if}
    </div>
</DrawerTemplate>
