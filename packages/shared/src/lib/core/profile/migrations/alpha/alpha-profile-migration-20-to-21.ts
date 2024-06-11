import { IPersistedProfile } from '@core/profile/interfaces'
import { migrateEvmContacts } from '../../migrations/actions/migrateEvmContacts'

export function alphaProfileMigration20To21(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    migrateEvmContacts(profile)

    return Promise.resolve()
}
