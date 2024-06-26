import { DEFAULT_EVM_NETWORK_CONFIGURATIONS_FOR_STARDUST_NETWORK } from '@core/network'
import { IPersistedProfile } from '@core/profile/interfaces'

export function alphaProfileMigration21To22(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    if (!profile.evmNetworks || profile.evmNetworks.length === 0) {
        profile.evmNetworks = DEFAULT_EVM_NETWORK_CONFIGURATIONS_FOR_STARDUST_NETWORK[profile.network.id] ?? []
    }

    return Promise.resolve()
}
