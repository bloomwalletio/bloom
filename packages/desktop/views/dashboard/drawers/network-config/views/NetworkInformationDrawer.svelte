<script lang="ts">
    import { DrawerTemplate } from '@components'
    import { selectedChain, NetworkNamespace } from '@core/network'
    import { Router } from '@core/router'
    import { NetworkConfigRoute } from '../'
    import { EvmChainInformation, StardustInformation } from './components'

    export let drawerRouter: Router<NetworkConfigRoute>
</script>

<DrawerTemplate title={$selectedChain?.name} {drawerRouter}>
    <div class="w-full h-full px-6">
        {#if $selectedChain && $selectedChain.namespace === NetworkNamespace.Evm}
            <EvmChainInformation network={$selectedChain} />
        {:else if $selectedChain && $selectedChain.namespace === NetworkNamespace.Stardust}
            <StardustInformation />
        {/if}
    </div>
</DrawerTemplate>
