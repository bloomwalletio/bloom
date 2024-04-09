<script lang="ts">
    import { DrawerTemplate, NetworkCard } from '@components'
    import { localize } from '@core/i18n'
    import { IChain, clearSelectedChain, network, networkStatus, setSelectedChain } from '@core/network'
    import { Router } from '@core/router'
    import networkFeatures from '@features/network.features'
    import { onMount } from 'svelte'
    import { NetworkConfigRoute, networkConfigRouter } from '../'
    import { Button, IconName } from '@bloomwalletio/ui'

    export let drawerRouter: Router<NetworkConfigRoute>

    function onL1NetworkCardClick(): void {
        $networkConfigRouter.goTo(NetworkConfigRoute.NetworkSettings)
    }

    function onL2NetworkCardClick(chain: IChain): void {
        setSelectedChain(chain)
        $networkConfigRouter.goTo(NetworkConfigRoute.ChainInformation)
    }

    function onQrCodeIconClick(chain?: IChain): void {
        if (chain) {
            setSelectedChain(chain)
        }
        $networkConfigRouter.goTo(NetworkConfigRoute.ChainDepositAddress)
    }

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
            {#key $networkStatus}
                <NetworkCard
                    network={$network}
                    onCardClick={onL1NetworkCardClick}
                    onQrCodeIconClick={() => onQrCodeIconClick()}
                />
                {#each $network?.getChains() ?? [] as chain}
                    <NetworkCard
                        {chain}
                        onCardClick={() => onL2NetworkCardClick(chain)}
                        onQrCodeIconClick={() => onQrCodeIconClick(chain)}
                    />
                {/each}
            {/key}
        </div>
    </connected-chains-drawer>
    <div slot="footer" class="flex justify-center">
        {#if networkFeatures.config.addChain.enabled}
            <Button
                variant="text"
                icon={IconName.Plus}
                text={localize('actions.addChain')}
                on:click={onAddChainClick}
            />
        {/if}
    </div>
</DrawerTemplate>
