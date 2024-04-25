import { ProfileMigrationMap } from '../../types'

import { prodProfileMigration0To1 } from './prod-profile-migration-0-to-1'
import { prodProfileMigration1To2 } from './prod-profile-migration-1-to-2'
import { prodProfileMigration2To3 } from './prod-profile-migration-2-to-3'
import { prodProfileMigration3To4 } from './prod-profile-migration-3-to-4'
import { prodProfileMigration4To5 } from './prod-profile-migration-4-to-5'
import { prodProfileMigration5To6 } from './prod-profile-migration-5-to-6'
import { prodProfileMigration6To7 } from './prod-profile-migration-6-to-7'
import { prodProfileMigration7To8 } from './prod-profile-migration-7-to-8'

export const PROD_PROFILE_MIGRATION_MAP: ProfileMigrationMap = {
    0: prodProfileMigration0To1,
    1: prodProfileMigration1To2,
    2: prodProfileMigration2To3,
    3: prodProfileMigration3To4,
    4: prodProfileMigration4To5,
    5: prodProfileMigration5To6,
    6: prodProfileMigration6To7,
    7: prodProfileMigration7To8,
}
