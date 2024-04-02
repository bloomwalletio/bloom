import { ThirdPartyAppName } from '@auxiliary/third-party/enums'
import { IThirdPartyPersistedProfile } from '@auxiliary/third-party/interfaces'
import { THIRD_PARTY_PROFILE_MIGRATION_APP_NAME_MAP } from '../third-party-profile-migration-app-name-map'
import { THIRD_PARTY_PROFILE_VERSION } from '@auxiliary/third-party/constants'

export function migrateThirdPartyPersistedProfiles(
    profiles: IThirdPartyPersistedProfile[],
    appName: ThirdPartyAppName,
    profileVersion: number | undefined
): IThirdPartyPersistedProfile[] {
    const _profiles = profiles.map((profile) => {
        try {
            // If the profile version is not found, it means that the profile is not migrated from chrysalis to stardust in its source app
            // therefore we don't currently support migrating it through the stardust migration pipeline
            if (!profileVersion) {
                return {
                    ...profile,
                    needsChrysalisToStardustDbMigration: true,
                }
            }

            // If the profile version exists then we will push it through the migration pipeline
            let currentVersion = profileVersion

            for (currentVersion; currentVersion < THIRD_PARTY_PROFILE_VERSION?.[appName]; currentVersion++) {
                THIRD_PARTY_PROFILE_MIGRATION_APP_NAME_MAP?.[appName]?.[currentVersion]?.(profile)
                currentVersion = currentVersion + 1
                profile = { ...profile, version: currentVersion }
            }
            profile = { ...profile, version: THIRD_PARTY_PROFILE_VERSION?.[appName] }
        } catch (err) {
            console.error(err)
        }
        return profile
    })
    return _profiles
}
