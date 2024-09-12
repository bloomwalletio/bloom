import { IIscChainConfiguration } from '@core/network'
import { KNOWN_EVM_NETWORKS_CONFIGURATIONS } from '@core/network/constants'
import { IPersistedProfile } from '@core/profile/interfaces'

export function prodProfileMigration15To16(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    const chainConfigurations = profile.network.chainConfigurations as (IIscChainConfiguration & {
        explorerUrl?: string
    })[]
    chainConfigurations.forEach((chainConfiguration) => {
        delete chainConfiguration.explorerUrl
        chainConfiguration.explorer = KNOWN_EVM_NETWORKS_CONFIGURATIONS.find(
            (networkConfiguration) => networkConfiguration.id === chainConfiguration.id
        )?.explorer
    })

    return Promise.resolve()
}
