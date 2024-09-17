import { ProfileMigrationMap } from '../../types'

import { prodProfileMigration0To1 } from './prod-profile-migration-0-to-1'
import { prodProfileMigration1To2 } from './prod-profile-migration-1-to-2'
import { prodProfileMigration2To3 } from './prod-profile-migration-2-to-3'
import { prodProfileMigration3To4 } from './prod-profile-migration-3-to-4'
import { prodProfileMigration4To5 } from './prod-profile-migration-4-to-5'
import { prodProfileMigration5To6 } from './prod-profile-migration-5-to-6'
import { prodProfileMigration6To7 } from './prod-profile-migration-6-to-7'
import { prodProfileMigration7To8 } from './prod-profile-migration-7-to-8'
import { prodProfileMigration9To10 } from './prod-profile-migration-9-to-10'
import { prodProfileMigration8To9 } from './prod-profile-migration-8-to-9'
import { prodProfileMigration10To11 } from './prod-profile-migration-10-to-11'
import { prodProfileMigration11To12 } from './prod-profile-migration-11-to-12'
import { prodProfileMigration12To13 } from './prod-profile-migration-12-to-13'
import { prodProfileMigration13To14 } from './prod-profile-migration-13-to-14'
import { prodProfileMigration14To15 } from './prod-profile-migration-14-to-15'

export const PROD_PROFILE_MIGRATION_MAP: ProfileMigrationMap = {
    0: prodProfileMigration0To1,
    1: prodProfileMigration1To2,
    2: prodProfileMigration2To3,
    3: prodProfileMigration3To4,
    4: prodProfileMigration4To5,
    5: prodProfileMigration5To6,
    6: prodProfileMigration6To7,
    7: prodProfileMigration7To8,
    // ^^^ release 1.0.2 ^^^
    8: prodProfileMigration8To9,
    // ^^^ release 1.0.3 ^^^
    9: prodProfileMigration9To10, // rechecking some previous migrations due to a bug during migrations
    10: prodProfileMigration10To11,
    // ^^^ release 1.0.4 ^^^
    11: prodProfileMigration11To12,
    // ^^^ release 1.0.8 ^^^
    12: prodProfileMigration12To13,
    // ^^^ release 1.1.2 ^^^
    13: prodProfileMigration13To14,
    // ^^^ release 1.1.3 ^^^
    14: prodProfileMigration14To15,
}
