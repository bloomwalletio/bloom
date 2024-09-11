<script lang="ts">
    import { Button, IconName } from '@bloomwalletio/ui'
    import { DrawerTemplate, NetworkCard } from '@components'
    import { Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import { clearSelectedNetworkForNetworkDrawer, networks } from '@core/network'
    import { Router } from '@core/router'
    import { onMount } from 'svelte'
    import { NetworkConfigRoute, networkConfigRouter } from '../'

    export let drawerRouter: Router<NetworkConfigRoute>

    function onAddChainClick(): void {
        $networkConfigRouter.goTo(NetworkConfigRoute.ManageNetworks)
    }

    onMount(() => {
        clearSelectedNetworkForNetworkDrawer()
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
        {#if Platform.isFeatureFlagEnabled('network.config.manageNetworks')}
            <Button
                variant="text"
                text={localize('views.dashboard.drawers.networkConfig.manageNetworks.title')}
                icon={IconName.Plus}
                on:click={onAddChainClick}
            />
        {/if}
    </div>
</DrawerTemplate>
