import { AppStage } from '@core/app/enums'
import { IPersistedProfile } from '@core/profile/interfaces'

export function betaProfileMigration0To1(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile
    profile.versionTrack = AppStage.ALPHA
    return Promise.resolve()
}
