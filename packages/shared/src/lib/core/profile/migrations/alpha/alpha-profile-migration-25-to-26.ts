import { IIscChainConfiguration, IPureEvmNetworkConfiguration } from '@core/network'
import { DEFAULT_EXPLORER_CONFIGS } from '@core/network/constants'
import { IPersistedProfile } from '@core/profile/interfaces'

export function alphaProfileMigration25To26(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile & {
        network: {
            explorerUrl?: string
        }
    }

    delete profile.network.explorerUrl
    profile.network.explorer = DEFAULT_EXPLORER_CONFIGS[profile.network.id]

    const chainConfigurations = profile.network.chainConfigurations as (IIscChainConfiguration & {
        explorerUrl?: string
    })[]
    chainConfigurations.forEach((chainConfiguration) => {
        delete chainConfiguration.explorerUrl
        chainConfiguration.explorer = DEFAULT_EXPLORER_CONFIGS[chainConfiguration.id]
    })

    const evmNetworks = profile.evmNetworks as (IPureEvmNetworkConfiguration & { explorerUrl?: string })[]
    evmNetworks.forEach((evmNetwork) => {
        delete evmNetwork.explorerUrl
        evmNetwork.explorer = DEFAULT_EXPLORER_CONFIGS[evmNetwork.id]
    })

    return Promise.resolve()
}
