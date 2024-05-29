import { IPersistedProfile } from '../../interfaces'
import { migrateEvmContacts } from '../../migrations/actions/migrateEvmContacts'

export function alphaProfileMigration19To20(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    migrateEvmContacts(profile)

    return Promise.resolve()
}
