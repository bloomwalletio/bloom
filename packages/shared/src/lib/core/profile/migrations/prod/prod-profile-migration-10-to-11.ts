import { IPersistedProfile } from '../../interfaces'
import { migrateEvmContacts } from '../actions/migrateEvmContacts'

export function prodProfileMigration10To11(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    migrateEvmContacts(profile)

    return Promise.resolve()
}
