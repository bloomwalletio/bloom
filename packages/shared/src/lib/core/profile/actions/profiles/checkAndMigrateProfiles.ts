import { APP_STAGE } from '@core/app'
import { get } from 'svelte/store'
import { PROFILE_VERSION } from '../../constants'
import { profiles, updatePersistedProfile } from '../../stores'
import { PROFILE_MIGRATION_STAGE_MAP } from '../../migrations/profile-migration-stage-map'

/**
 * Migrates profile data in need of being modified to accommodate changes
 * in a newer Bloom version.
 */
export async function checkAndMigrateProfiles(): Promise<void> {
    await migratePersistedProfiles()
}

async function migratePersistedProfiles(): Promise<void> {
    const _profiles = get(profiles)
    for (const profile of _profiles) {
        try {
            let currentVersion = profile.version ?? 0

            for (currentVersion; currentVersion < PROFILE_VERSION?.[APP_STAGE]; currentVersion++) {
                await PROFILE_MIGRATION_STAGE_MAP?.[APP_STAGE]?.[currentVersion]?.(profile)
                updatePersistedProfile(profile.id, { ...profile, version: currentVersion + 1 })
            }
        } catch (err) {
            console.error(err)
        }
    }
}
