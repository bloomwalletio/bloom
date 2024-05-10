import { DEFAULT_EXPLORER_URLS } from '@core/network'
import { IPersistedProfile } from '@core/profile/interfaces'

export function alphaProfileMigration18To19(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    profile.network = {
        ...profile.network,
        explorerUrl: structuredClone(DEFAULT_EXPLORER_URLS[profile.network.id]),
    }

    return Promise.resolve()
}
