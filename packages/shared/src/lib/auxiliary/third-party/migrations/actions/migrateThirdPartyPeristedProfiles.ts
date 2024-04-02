import { ThirdPartyAppName } from '@auxiliary/third-party/enums'
import { IThirdPartyPersistedProfile } from '@auxiliary/third-party/interfaces'
import { THIRD_PARTY_PROFILE_MIGRATION_APP_NAME_MAP } from '../third-party-profile-migration-app-name-map'

const THIRD_PARTY_PROFILE_VERSION = {
    [ThirdPartyAppName.Firefly]: 17,
    [ThirdPartyAppName.FireflyShimmer]: 17,
}

export function migrateThirdPartyPersistedProfiles(profiles: IThirdPartyPersistedProfile[], appName: ThirdPartyAppName, profileVersion: number): IThirdPartyPersistedProfile[] {
    profiles.map((profile) => {
        try {
            let currentVersion = profileVersion ?? 0
            console.log(currentVersion, THIRD_PARTY_PROFILE_VERSION?.[appName])

            for (currentVersion; currentVersion < THIRD_PARTY_PROFILE_VERSION?.[appName]; currentVersion++) {
                console.log("migration", currentVersion)
                THIRD_PARTY_PROFILE_MIGRATION_APP_NAME_MAP?.[appName]?.[currentVersion]?.(profile)
                currentVersion = currentVersion + 1
                profile = { ...profile, version: currentVersion }
                console.log(profile)
            }
            profile = { ...profile, version: THIRD_PARTY_PROFILE_VERSION?.[appName] }
            console.log("fully updated profile:", profile)
        } catch (err) {
            console.error(err)
        }
        return profile
    })
    return profiles
}
