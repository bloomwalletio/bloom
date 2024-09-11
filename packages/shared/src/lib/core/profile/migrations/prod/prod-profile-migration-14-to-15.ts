import { DEFAULT_BLOCKSCOUT_INDEXER_URLS } from '@core/network/constants'
import { IPersistedProfile } from '@core/profile/interfaces'

export function prodProfileMigration14To15(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    profile.network.chainConfigurations.forEach((chainConfiguration) => {
        chainConfiguration.blockscoutIndexerUrl = DEFAULT_BLOCKSCOUT_INDEXER_URLS[chainConfiguration.id]
    })

    profile.evmNetworks.forEach((evmNetwork) => {
        evmNetwork.blockscoutIndexerUrl = DEFAULT_BLOCKSCOUT_INDEXER_URLS[evmNetwork.id]
    })

    return Promise.resolve()
}
