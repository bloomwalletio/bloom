import { ProfileMigrationMap } from '../../types'
import { betaProfileMigration0To1 } from './beta-profile-migration-0-to-1'

export const BETA_PROFILE_MIGRATION_MAP: ProfileMigrationMap = {
    0: betaProfileMigration0To1,
}
