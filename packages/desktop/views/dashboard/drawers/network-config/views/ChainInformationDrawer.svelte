<script lang="ts">
    import { DrawerTemplate } from '@components'
    import { ChainType, IscpChain, selectedChain } from '@core/network'
    import { Router } from '@core/router'
    import { NetworkConfigRoute } from '../'
    import { EvmChainInformation, IscpChainInformation } from './components'

    export let drawerRouter: Router<NetworkConfigRoute>

    $: chain = $selectedChain as IscpChain
</script>

<DrawerTemplate title={chain?.name} {drawerRouter}>
    <div class="w-full h-full px-6">
        {#if chain?.type === ChainType.Iscp}
            <IscpChainInformation {chain} />
        {:else if chain?.type === ChainType.Evm}
            <EvmChainInformation />
        {/if}
    </div>
</DrawerTemplate>
