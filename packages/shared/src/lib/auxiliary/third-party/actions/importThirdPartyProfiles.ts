import { addNewPersistedProfile } from '@core/profile/stores'
import { IThirdPartyPersistedProfile } from '../interfaces'
import { buildPersistedProfileFromThirdPartyPersistedProfile } from '../utils'

export function importThirdPartyProfiles(profiles: IThirdPartyPersistedProfile[]): void {
    for (const profile of profiles) {
        // 1. build persisted profile
        const persistedProfile = buildPersistedProfileFromThirdPartyPersistedProfile(profile)
        if (!persistedProfile) {
            continue
        }

        // 2. copy profile folder to profile directory
        // copyStrongholdFileToProfileDirectory(persistedProfile.id, )

        // 3. add new persisted profile
        addNewPersistedProfile(persistedProfile)
    }
}
