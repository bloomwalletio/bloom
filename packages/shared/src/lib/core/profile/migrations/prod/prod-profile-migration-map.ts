import { ProfileMigrationMap } from '../../types'

import { prodProfileMigration0To1 } from './prod-profile-migration-0-to-1'

export const PROD_PROFILE_MIGRATION_MAP: ProfileMigrationMap = {
    0: prodProfileMigration0To1,
}
