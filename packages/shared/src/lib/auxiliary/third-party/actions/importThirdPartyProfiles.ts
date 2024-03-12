import { addNewPersistedProfile } from '@core/profile/stores'
import { IThirdPartyPersistedProfile } from '../interfaces'
import { buildPersistedProfileFromThirdPartyPersistedProfile } from '../utils'
import { Platform } from '@core/app'
import { ThirdPartyAppName } from '../enums'

export async function importThirdPartyProfiles(
    appName: ThirdPartyAppName,
    profiles: IThirdPartyPersistedProfile[]
): Promise<void> {
    for (const profile of profiles) {
        // 1. build persisted profile
        const persistedProfile = buildPersistedProfileFromThirdPartyPersistedProfile(profile, appName)
        if (!persistedProfile) {
            continue
        }

        // 2. copy profile folder to profile directory
        await Platform.copyProfileDirectory(appName, persistedProfile.id)

        // 3. add new persisted profile
        addNewPersistedProfile(persistedProfile)
    }
}
