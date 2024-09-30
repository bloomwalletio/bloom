import { DEFAULT_NOVES_INDEXER_URLS } from '@core/network'
import { IPersistedProfile } from '@core/profile/interfaces'

export function alphaProfileMigration27To28(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    profile.network.chainConfigurations.forEach((chainConfiguration) => {
        chainConfiguration.novesIndexerUrl = DEFAULT_NOVES_INDEXER_URLS[chainConfiguration.id]
    })

    profile.evmNetworks.forEach((evmNetwork) => {
        evmNetwork.novesIndexerUrl = DEFAULT_NOVES_INDEXER_URLS[evmNetwork.id]
    })

    return Promise.resolve()
}
