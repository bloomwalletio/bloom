import { IPersistedProfile } from '@core/profile/interfaces'

export function alphaProfileMigration18To19(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    profile.network = {
        ...profile.network,
    }

    return Promise.resolve()
}
