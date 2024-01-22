import { ProfileMigrationMap } from '../../types'

import { prodProfileMigration0To1 } from './prod-profile-migration-0-to-1'
import { prodProfileMigration1To2 } from './prod-profile-migration-1-to-2'

export const PROD_PROFILE_MIGRATION_MAP: ProfileMigrationMap = {
    0: prodProfileMigration0To1,
    1: prodProfileMigration1To2,
}
