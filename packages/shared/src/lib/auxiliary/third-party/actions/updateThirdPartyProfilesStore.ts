import { profiles } from '@core/profile/stores'
import { ThirdPartyAppName } from '../enums'
import { ThirdPartyProfileStore, thirdPartyProfiles } from '../stores'
import { getThirdPartyPersistedProfiles } from './getThirdPartyPersistedProfiles'
import { get } from 'svelte/store'

export async function updateThirdPartyProfilesStore(): Promise<void> {
    const _thirdPartyProfiles: ThirdPartyProfileStore = {}
    for (const appName of Object.values(ThirdPartyAppName)) {
        try {
            const appProfiles = await getThirdPartyPersistedProfiles(appName)

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
            // Do nothing
        }
    }

    thirdPartyProfiles.set(_thirdPartyProfiles)
}
