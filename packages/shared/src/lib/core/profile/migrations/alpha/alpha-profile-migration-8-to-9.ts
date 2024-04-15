import { IPersistedProfile } from '@core/profile/interfaces'

export function alphaProfileMigration8To9(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile
    // add features to profile object
    profile.features = {
        wallet: true,
        collectibles: true,
        campaigns: true,
        governance: true,
        buySell: true,
        // @ts-expect-error isDeveloperProfile was removed in favor of the feature flag, but it exists on old profiles
        developer: profile.isDeveloperProfile,
        settings: true,
    }
    return Promise.resolve()
}
