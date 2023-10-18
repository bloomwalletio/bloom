import { get } from 'svelte/store'
import { PROFILE_VERSION } from '../../constants'
import { currentProfileVersion, profiles } from '../../stores'
import { removeProfileFolder } from '@core/profile/utils'

/**
 * Migrates profile data in need of being modified to accommodate changes
 * in a newer Bloom version.
 */
export async function checkAndMigrateProfiles(): Promise<void> {
    const shouldMigratePersistedProfiles = get(currentProfileVersion) < PROFILE_VERSION
    if (shouldMigratePersistedProfiles) {
        await migrateEachVersion()
    }
}

async function migrateEachVersion(): Promise<void> {
    let migrationVersion = get(currentProfileVersion)
    for (migrationVersion; migrationVersion < PROFILE_VERSION; migrationVersion++) {
        await migratePersistedProfile(migrationVersion)
        currentProfileVersion.set(migrationVersion + 1)
    }
}

async function migratePersistedProfile(migrationVersion: number): Promise<void> {
    const _profiles = get(profiles)
    for (const profile of _profiles) {
        try {
            await persistedProfileMigrationsMap?.[migrationVersion]?.(profile)
        } catch (err) {
            console.error(err)
        }
    }
}

const persistedProfileMigrationsMap: Record<number, (existingProfile: unknown) => Promise<void>> = {
    1: removeProfile,
}

async function removeProfile(existingProfile: unknown): Promise<void> {
    const profileId = (existingProfile as { id?: string })?.id
    if (profileId) {
        await removeProfileFolder(profileId)
    }
}
