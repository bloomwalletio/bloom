<script lang="ts">
    import { Button, Checkbox, IconName, Text, Tile } from '@bloomwalletio/ui'
    import { DrawerTemplate } from '@components'
    import { Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import {
        addNewEvmNetwork,
        KNOWN_EVM_MAINNET_NETWORKS_CONFIGURATIONS,
        KNOWN_EVM_TESTNET_NETWORKS_CONFIGURATIONS,
        SupportedNetworkId,
    } from '@core/network'
    import { activeProfile } from '@core/profile/stores'
    import { Router } from '@core/router'
    import { NetworkAvatar } from '@ui'
    import { NetworkConfigRoute } from '..'

    export let drawerRouter: Router<NetworkConfigRoute>

    const isTestnet = [SupportedNetworkId.IotaTestnet, SupportedNetworkId.Testnet].includes($activeProfile?.network?.id)

    const networkConfigurations = isTestnet
        ? KNOWN_EVM_TESTNET_NETWORKS_CONFIGURATIONS
        : KNOWN_EVM_MAINNET_NETWORKS_CONFIGURATIONS

    const selectedChains = networkConfigurations.reduce((acc, networkConfiguration) => {
        acc[networkConfiguration.id] = $activeProfile?.evmNetworks.some(
            (network) => network.id === networkConfiguration.id
        )
        return acc
    }, {})

    function onAddCustomChainClick(): void {
        drawerRouter.goTo(NetworkConfigRoute.AddCustomChain)
    }

    async function onContinueClick(): Promise<void> {
        const promises = Object.keys(selectedChains).map(async (networkId) => {
            if (!selectedChains[networkId] || $activeProfile?.evmNetworks.some((network) => network.id === networkId)) {
                return
            }

            const evmNetworkConfiguration = networkConfigurations.find(
                (networkConfiguration) => networkConfiguration.id === networkId
            )

            if (!evmNetworkConfiguration) {
                return
            }

            await addNewEvmNetwork(evmNetworkConfiguration)
        })

        await Promise.all(promises)

        drawerRouter.previous()
    }
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.networkConfig.manageNetworks.title')} {drawerRouter}>
    <known-chains class="h-full flex flex-col gap-4 px-6">
        {#each networkConfigurations as chainConfiguration}
            <Tile border>
                <div class="w-full flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <NetworkAvatar networkId={chainConfiguration.id} />
                        <Text>{chainConfiguration.name}</Text>
                    </div>
                    <Checkbox
                        bind:checked={selectedChains[chainConfiguration.id]}
                        disabled={$activeProfile?.evmNetworks.some((network) => network.id === chainConfiguration.id)}
                    />
                </div>
            </Tile>
        {/each}
        {#if Platform.isFeatureFlagEnabled('network.config.manageNetworks.customChain')}
            <Button
                variant="text"
                text={'views.dashboard.drawers.networkConfig.addChain.title'}
                icon={IconName.Plus}
                on:click={onAddCustomChainClick}
            />
        {/if}
    </known-chains>
    <div slot="footer" class="flex justify-center">
        <Button type="button" width="full" text={localize('actions.continue')} on:click={onContinueClick} />
    </div>
</DrawerTemplate>
