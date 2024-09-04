<script lang="ts">
    import { DrawerTemplate } from '@components'
    import { localize } from '@core/i18n'
    import { Router } from '@core/router'
    import { NetworkConfigRoute } from '../'
    import { Button, Checkbox, IconName, Text, Tile } from '@bloomwalletio/ui'
    import {
        addNewEvmNetwork,
        ChainId,
        DEFAULT_BASE_TOKEN,
        ETHEREUM_COIN_TYPE,
        IPureEvmNetworkConfiguration,
        NetworkNamespace,
        NetworkType,
        SupportedNetworkId,
        SupportedL2EvmNetworkId,
    } from '@core/network'
    import { NetworkAvatar } from '@ui'
    import { activeProfile } from '@core/profile/stores'
    import { Platform } from '@core/app'

    export let drawerRouter: Router<NetworkConfigRoute>

    interface EvmChain {
        chainId: ChainId
        name: string
        explorerUrl: string
        rpcEndpoint: string
    }

    const KNOWN_CHAINS: Record<SupportedL2EvmNetworkId, EvmChain> = {
        [SupportedL2EvmNetworkId.Optimism]: {
            chainId: ChainId.Optimism,
            name: 'Optimism',
            explorerUrl: 'https://optimism.blockscout.com',
            rpcEndpoint: 'https://optimism.drpc.org',
        },
        [SupportedL2EvmNetworkId.Blast]: {
            chainId: ChainId.Blast,
            name: 'Blast',
            explorerUrl: 'https://blast.blockscout.com',
            rpcEndpoint: 'https://rpc.blast.io',
        },
        [SupportedL2EvmNetworkId.Base]: {
            chainId: ChainId.Base,
            name: 'Base',
            explorerUrl: 'https://base.blockscout.com',
            rpcEndpoint: 'https://mainnet.base.org/',
        },
        [SupportedL2EvmNetworkId.Immutable]: {
            chainId: ChainId.Immutable,
            name: 'Immutable',
            explorerUrl: 'https://explorer.immutable.com',
            rpcEndpoint: 'https://rpc.immutable.com',
        },
        [SupportedL2EvmNetworkId.Arbitrum]: {
            chainId: ChainId.Arbitrum,
            name: 'Arbitrum',
            explorerUrl: 'https://arbitrum.blockscout.com',
            rpcEndpoint: 'https://arbitrum-one.publicnode.com',
        },
    }

    const selectedChains = Object.keys(KNOWN_CHAINS).reduce((acc, chain) => {
        acc[chain] = $activeProfile?.evmNetworks.some((network) => network.id === chain)
        return acc
    }, {})

    function onAddCustomChainClick(): void {
        drawerRouter.goTo(NetworkConfigRoute.AddCustomChain)
    }

    async function onContinueClick(): Promise<void> {
        const promises = Object.keys(selectedChains).map(async (chainId) => {
            if (!selectedChains[chainId] || $activeProfile?.evmNetworks.some((network) => network.id === chainId)) {
                return
            }

            const { name, rpcEndpoint, explorerUrl } = KNOWN_CHAINS[chainId]

            const evmNetworkConfiguration: IPureEvmNetworkConfiguration = {
                type: NetworkType.Evm,
                id: chainId,
                namespace: NetworkNamespace.Evm,
                chainId: KNOWN_CHAINS[chainId].chainId,
                name,
                rpcEndpoint,
                explorerUrl,
                coinType: ETHEREUM_COIN_TYPE,
                baseToken: DEFAULT_BASE_TOKEN[SupportedNetworkId.Ethereum],
            }

            await addNewEvmNetwork(evmNetworkConfiguration)
        })

        await Promise.all(promises)

        drawerRouter.previous()
    }
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.networkConfig.addChain.title')} {drawerRouter}>
    <known-chains class="h-full flex flex-col gap-4 px-6">
        {#each Object.keys(KNOWN_CHAINS) as chain}
            <Tile border>
                <div class="w-full flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <NetworkAvatar networkId={chain} />
                        <Text>{KNOWN_CHAINS[chain].name}</Text>
                    </div>
                    <Checkbox
                        bind:checked={selectedChains[chain]}
                        disabled={$activeProfile?.evmNetworks.some((network) => network.id === chain)}
                    />
                </div>
            </Tile>
        {/each}
        {#if Platform.isFeatureFlagEnabled('network.config.addChain.customChain')}
            <Button variant="text" text="Add custom chain" icon={IconName.Plus} on:click={onAddCustomChainClick} />
        {/if}
    </known-chains>
    <div slot="footer" class="flex justify-center">
        <Button type="button" width="full" text={localize('actions.continue')} on:click={onContinueClick} />
    </div>
</DrawerTemplate>
