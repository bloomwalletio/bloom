<script lang="ts">
    import { DrawerTemplate } from '@components'
    import { NetworkType, IscChain, selectedChain } from '@core/network'
    import { Router } from '@core/router'
    import { NetworkConfigRoute } from '../'
    import { EvmChainInformation, IscChainInformation } from './components'

    export let drawerRouter: Router<NetworkConfigRoute>

    $: evmNetwork = $selectedChain as IscChain
</script>

<DrawerTemplate title={evmNetwork?.name} {drawerRouter}>
    <div class="w-full h-full px-6">
        {#if evmNetwork?.type === NetworkType.Isc}
            <IscChainInformation {evmNetwork} />
        {:else if evmNetwork?.type === NetworkType.Evm}
            <EvmChainInformation />
        {/if}
    </div>
</DrawerTemplate>
