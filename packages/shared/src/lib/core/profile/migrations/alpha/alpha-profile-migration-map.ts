import { ProfileMigrationMap } from '../../types'
import { alphaProfileMigration0To1 } from './alpha-profile-migration-0-to-1'
import { alphaProfileMigration1To2 } from './alpha-profile-migration-1-to-2'
import { alphaProfileMigration10To11 } from './alpha-profile-migration-10-to-11'
import { alphaProfileMigration11To12 } from './alpha-profile-migration-11-to-12'
import { alphaProfileMigration12To13 } from './alpha-profile-migration-12-to-13'
import { alphaProfileMigration13To14 } from './alpha-profile-migration-13-to-14'
import { alphaProfileMigration14To15 } from './alpha-profile-migration-14-to-15'
import { alphaProfileMigration2To3 } from './alpha-profile-migration-2-to-3'
import { alphaProfileMigration3To4 } from './alpha-profile-migration-3-to-4'
import { alphaProfileMigration4To5 } from './alpha-profile-migration-4-to-5'
import { alphaProfileMigration5To6 } from './alpha-profile-migration-5-to-6'
import { alphaProfileMigration6To7 } from './alpha-profile-migration-6-to-7'
import { alphaProfileMigration7To8 } from './alpha-profile-migration-7-to-8'
import { alphaProfileMigration8To9 } from './alpha-profile-migration-8-to-9'
import { alphaProfileMigration9To10 } from './alpha-profile-migration-9-to-10'

export const ALPHA_PROFILE_MIGRATION_MAP: ProfileMigrationMap = {
    0: alphaProfileMigration0To1,
    1: alphaProfileMigration1To2,
    2: alphaProfileMigration2To3,
    3: alphaProfileMigration3To4,
    4: alphaProfileMigration4To5,
    5: alphaProfileMigration5To6,
    6: alphaProfileMigration6To7,
    7: alphaProfileMigration7To8,
    8: alphaProfileMigration8To9,
    9: alphaProfileMigration9To10,
    10: alphaProfileMigration10To11,
    11: alphaProfileMigration11To12,
    12: alphaProfileMigration12To13,
    13: alphaProfileMigration13To14,
    14: alphaProfileMigration14To15,
}
