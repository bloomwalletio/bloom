<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { DrawerTemplate, NetworkCard } from '@components'
    import { localize } from '@core/i18n'
    import { clearSelectedChain, networks } from '@core/network'
    import { Router } from '@core/router'
    import features from '@features/features'
    import { Icon } from '@ui'
    import { onMount } from 'svelte'
    import { NetworkConfigRoute, networkConfigRouter } from '../'

    export let drawerRouter: Router<NetworkConfigRoute>

    function onAddChainClick(): void {
        $networkConfigRouter.goTo(NetworkConfigRoute.AddChain)
    }

    onMount(() => {
        clearSelectedChain()
    })
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.networkConfig.connectedChains.title')} {drawerRouter}>
    <connected-chains-drawer class="h-full flex flex-col justify-between px-6">
        <div class="flex flex-col gap-4">
            {#each $networks as network}
                <NetworkCard {network} />
            {/each}
        </div>
        {#if features.network.config.addChain.enabled}
            <button
                type="button"
                class="flex flex-row items-center justify-center w-full space-x-2 bg-transparent text-blue-500 px-8 py-3 text-15 rounded-lg"
                on:click|stopPropagation={onAddChainClick}
            >
                <Icon icon={IconEnum.Plus} height={12} />
                {localize('actions.addChain')}
            </button>
        {/if}
    </connected-chains-drawer>
</DrawerTemplate>
