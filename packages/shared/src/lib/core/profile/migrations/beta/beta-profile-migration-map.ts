import { ProfileMigrationMap } from '../../types'
import { betaProfileMigration0To1 } from './beta-profile-migration-0-to-1'

export const BETA_PROFILE_MIGRATION_MAP: ProfileMigrationMap = {
    0: betaProfileMigration0To1,
    // ^^^ release 1.0.2 ^^^
    // Migration needed to catch up with the latest changes
    // ^^^ release 1.0.3 ^^^
}
