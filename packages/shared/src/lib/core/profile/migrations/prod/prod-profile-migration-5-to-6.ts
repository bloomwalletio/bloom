import { AppStage } from '@core/app/enums'
import { IPersistedProfile } from '@core/profile/interfaces'

export function prodProfileMigration5To6(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile
    // @ts-expect-error isDeveloperProfile is removed in favor of the feature flag
    delete profile.isDeveloperProfile
    profile.versionTrack = AppStage.PROD
    return Promise.resolve()
}
