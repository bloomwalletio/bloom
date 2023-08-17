<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { DrawerTemplate, NetworkCard } from '@components'
    import { localize } from '@core/i18n'
    import { IChain, clearSelectedChain, network, networkStatus, setSelectedChain } from '@core/network'
    import { Router, SettingsRoute, routerManager, settingsRouter } from '@core/router'
    import { closeDrawer } from '@desktop/auxiliary/drawer'
    import networkFeatures from '@features/network.features'
    import { Icon } from '@ui'
    import { onMount } from 'svelte'
    import { NetworkConfigRoute, networkConfigRouter } from '../'

    export let drawerRouter: Router<NetworkConfigRoute>

    function onL1NetworkCardClick(): void {
        closeDrawer()
        $routerManager.openSettings()
        $settingsRouter.goTo(SettingsRoute.Network)
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
    <connected-chains-drawer class="h-full flex flex-col justify-between">
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
        {#if networkFeatures.config.addChain.enabled}
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
