<script lang="ts">
    import { DrawerTemplate } from '@components'
    import { ChainConfiguration, ChainType, IscpChain, selectedChain } from '@core/network'
    import { Router } from '@core/router'
    import { onMount } from 'svelte'
    import { NetworkConfigRoute } from '../'
    import { EvmChainInformation, IscpChainInformation } from './components'

    export let drawerRouter: Router<NetworkConfigRoute>

    let chainConfiguration: ChainConfiguration

    function setChainConfiguration(): void {
        if ($selectedChain instanceof IscpChain) {
            chainConfiguration = $selectedChain.getConfiguration()
        }
    }

    onMount(() => {
        setChainConfiguration()
    })
</script>

<DrawerTemplate title={chainConfiguration?.name} {drawerRouter}>
    <div class="w-full h-full">
        {#if chainConfiguration?.type === ChainType.Iscp}
            <IscpChainInformation {chainConfiguration} />
        {:else if chainConfiguration?.type === ChainType.Evm}
            <EvmChainInformation />
        {/if}
    </div>
</DrawerTemplate>
