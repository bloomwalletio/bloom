<script lang="ts">
    import { onMount } from 'svelte'
    import { DrawerTemplate } from '@components'
    import { Pane } from '@ui'
    import { localize } from '@core/i18n'
    import { ChainType, IscpChain, selectedChain } from '@core/network'
    import { Router } from '@core/router'
    import { NetworkConfigRoute } from '../'
    import { EvmChainInformation, IscpChainInformation } from './components'

    export let drawerRouter: Router<NetworkConfigRoute>

    let chainConfiguration

    function setChainConfiguration(): void {
        if ($selectedChain instanceof IscpChain) {
            chainConfiguration = $selectedChain.getConfiguration()
        }
    }

    onMount(() => {
        setChainConfiguration()
    })
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.networkConfig.chainInformation.title')} {drawerRouter}>
    <div class="w-full h-full">
        <Pane>
            {#if chainConfiguration?.type === ChainType.Iscp}
                <IscpChainInformation {chainConfiguration} />
            {:else if chainConfiguration?.type === ChainType.Evm}
                <EvmChainInformation />
            {/if}
        </Pane>
    </div>
</DrawerTemplate>
