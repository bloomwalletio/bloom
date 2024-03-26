import { profiles } from '@core/profile/stores'
import { ThirdPartyAppName } from '../enums'
import { ThirdPartyProfileStore, thirdPartyProfiles } from '../stores'
import { getThirdPartyPersistedProfiles } from './getThirdPartyPersistedProfiles'
import { get } from 'svelte/store'

export async function updateThirdPartyProfilesStore(
    selectedApps: ThirdPartyAppName[]
): Promise<{ [key in ThirdPartyAppName]?: boolean }> {
    const _thirdPartyProfiles: ThirdPartyProfileStore = {}
    const updateStatus: { [key in ThirdPartyAppName]?: boolean } = {}
    for (const appName of selectedApps) {
        try {
            const appProfiles = await getThirdPartyPersistedProfiles(appName)
            updateStatus[appName] = true

            for (const appProfile of appProfiles) {
                const { needsChrysalisToStardustDbMigration = false } = appProfile
                const alreadyImported = get(profiles).some((profile) => profile.id === appProfile.id)

                const convertedAppProfile = {
                    profile: appProfile,
                    needsChrysalisToStardustDbMigration,
                    alreadyImported,
                    appName,
                }

                _thirdPartyProfiles[convertedAppProfile.profile.id] = convertedAppProfile
            }
        } catch {
            updateStatus[appName] = false
        }
    }
    thirdPartyProfiles.set(_thirdPartyProfiles)
    return updateStatus
}
