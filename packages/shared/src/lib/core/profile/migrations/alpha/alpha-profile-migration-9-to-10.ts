import { IPersistedProfile } from '@core/profile/interfaces'

export function alphaProfileMigration9To10(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile
    // @ts-expect-error isDeveloperProfile is removed in favor of the feature flag
    delete profile.isDeveloperProfile
    return Promise.resolve()
}
