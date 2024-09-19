import { DEFAULT_EVM_NETWORK_CONFIGURATION, DEFAULT_ISC_CHAINS_CONFIGURATIONS, StardustNetworkId } from '@core/network'
import { IPersistedProfile } from '@core/profile/interfaces'

export function alphaProfileMigration26To27(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile & {
        network: {
            id: StardustNetworkId
        }
    }

    profile.network.chainConfigurations.forEach((chainConfiguration) => {
        chainConfiguration.blocksUntilConfirmed =
            DEFAULT_ISC_CHAINS_CONFIGURATIONS[profile.network.id]?.blocksUntilConfirmed ?? 0
    })

    profile.evmNetworks.forEach((evmNetwork) => {
        evmNetwork.blocksUntilConfirmed = DEFAULT_EVM_NETWORK_CONFIGURATION[evmNetwork.id]?.blocksUntilConfirmed ?? 0
    })

    return Promise.resolve()
}
