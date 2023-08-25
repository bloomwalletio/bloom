import { get } from 'svelte/store'
import { PROFILE_VERSION } from '../../constants'
import { currentProfileVersion, profiles } from '../../stores'

/**
 * Migrates profile data in need of being modified to accommodate changes
 * in a newer Bloom version.
 */
export function checkAndMigrateProfiles(): void {
    const shouldMigratePersistedProfiles = get(currentProfileVersion) < PROFILE_VERSION
    if (shouldMigratePersistedProfiles) {
        migrateEachVersion()
    }
}

function migrateEachVersion(): void {
    let migrationVersion = get(currentProfileVersion)
    for (migrationVersion; migrationVersion < PROFILE_VERSION; migrationVersion++) {
        migratePersistedProfile(migrationVersion)
        currentProfileVersion.set(migrationVersion + 1)
    }
}

function migratePersistedProfile(migrationVersion: number): void {
    const _profiles = get(profiles)
    for (const profile of _profiles) {
        persistedProfileMigrationsMap?.[migrationVersion]?.(profile)
    }
}

const persistedProfileMigrationsMap: Record<number, (existingProfile: unknown) => void> = {}
