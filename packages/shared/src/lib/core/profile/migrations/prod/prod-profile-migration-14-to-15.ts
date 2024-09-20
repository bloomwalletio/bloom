import { IIscChainConfiguration, IPureEvmNetworkConfiguration, StardustNetworkId } from '@core/network'
import {
    DEFAULT_BLOCKSCOUT_INDEXER_URLS,
    DEFAULT_EVM_NETWORK_CONFIGURATION,
    DEFAULT_EXPLORER_CONFIGS,
    DEFAULT_ISC_CHAINS_CONFIGURATIONS,
} from '@core/network/constants'
import { IPersistedProfile } from '@core/profile/interfaces'

export function prodProfileMigration14To15(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile & {
        network: {
            id: StardustNetworkId
            explorerUrl?: string
        }
    }

    const chainConfigurations = profile.network.chainConfigurations as (IIscChainConfiguration & {
        explorerUrl?: string
    })[]
    chainConfigurations.forEach((chainConfiguration) => {
        chainConfiguration.blockscoutIndexerUrl = DEFAULT_BLOCKSCOUT_INDEXER_URLS[chainConfiguration.id]
        delete chainConfiguration.explorerUrl
        chainConfiguration.explorer = DEFAULT_EXPLORER_CONFIGS[chainConfiguration.id]
        chainConfiguration.blocksUntilConfirmed =
            DEFAULT_ISC_CHAINS_CONFIGURATIONS[profile.network.id]?.blocksUntilConfirmed ?? 0
    })

    const evmNetworks = profile.evmNetworks as (IPureEvmNetworkConfiguration & { explorerUrl?: string })[]
    evmNetworks.forEach((evmNetwork) => {
        evmNetwork.blockscoutIndexerUrl = DEFAULT_BLOCKSCOUT_INDEXER_URLS[evmNetwork.id]
        delete evmNetwork.explorerUrl
        evmNetwork.explorer = DEFAULT_EXPLORER_CONFIGS[evmNetwork.id]
        evmNetwork.blocksUntilConfirmed = DEFAULT_EVM_NETWORK_CONFIGURATION[evmNetwork.id].blocksUntilConfirmed
    })

    return Promise.resolve()
}
