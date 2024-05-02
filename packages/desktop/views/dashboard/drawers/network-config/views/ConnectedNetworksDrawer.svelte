<script lang="ts">
    import { DrawerTemplate, NetworkCard } from '@components'
    import { localize } from '@core/i18n'
    import { clearSelectedNetwork, networks } from '@core/network'
    import { Router } from '@core/router'
    import features from '@features/features'
    import { Button, IconName } from '@bloomwalletio/ui'
    import { onMount } from 'svelte'
    import { NetworkConfigRoute, networkConfigRouter } from '../'

    export let drawerRouter: Router<NetworkConfigRoute>

    function onAddChainClick(): void {
        $networkConfigRouter.goTo(NetworkConfigRoute.AddChain)
    }

    onMount(() => {
        clearSelectedNetwork()
    })
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.networkConfig.connectedChains.title')} {drawerRouter}>
    <connected-chains-drawer class="h-full flex flex-col justify-between px-6">
        <div class="flex flex-col gap-4">
            {#each $networks as network}
                <NetworkCard {network} />
            {/each}
        </div>
    </connected-chains-drawer>
    <div slot="footer" class="flex justify-center">
        {#if features.network.config.addChain.enabled}
            <Button
                variant="text"
                text={localize('actions.addChain')}
                icon={IconName.Plus}
                on:click={onAddChainClick}
            />
        {/if}
    </div>
</DrawerTemplate>
