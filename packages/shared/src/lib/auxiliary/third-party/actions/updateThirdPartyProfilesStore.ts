import { profiles } from '@core/profile/stores'
import { ThirdPartyAppName } from '../enums'
import { ThirdPartyProfileStore, thirdPartyProfiles } from '../stores'
import { getThirdPartyPersistedProfiles } from './getThirdPartyPersistedProfiles'
import { get } from 'svelte/store'

export async function updateThirdPartyProfilesStore(selectedApps: ThirdPartyAppName[]): Promise<void> {
    const _thirdPartyProfiles: ThirdPartyProfileStore = {}
    for (const appName of selectedApps) {
        const appProfiles = await getThirdPartyPersistedProfiles(appName)
        console.log("appProfiles", appProfiles)

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
    }
    thirdPartyProfiles.set(_thirdPartyProfiles)
}
