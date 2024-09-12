import { IIscChainConfiguration, IPureEvmNetworkConfiguration } from '@core/network'
import { DEFAULT_BLOCKSCOUT_INDEXER_URLS, DEFAULT_EXPLORER_CONFIGS } from '@core/network/constants'
import { IPersistedProfile } from '@core/profile/interfaces'

export function prodProfileMigration14To15(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile & {
        network: {
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
    })

    const evmNetworks = profile.evmNetworks as (IPureEvmNetworkConfiguration & { explorerUrl?: string })[]
    evmNetworks.forEach((evmNetwork) => {
        evmNetwork.blockscoutIndexerUrl = DEFAULT_BLOCKSCOUT_INDEXER_URLS[evmNetwork.id]
        delete evmNetwork.explorerUrl
        evmNetwork.explorer = DEFAULT_EXPLORER_CONFIGS[evmNetwork.id]
    })

    return Promise.resolve()
}
