import { ProfileMigrationMap } from '../../types'
import { alphaProfileMigration0To1 } from './alpha-profile-migration-0-to-1'
import { alphaProfileMigration1To2 } from './alpha-profile-migration-1-to-2'
import { alphaProfileMigration10To11 } from './alpha-profile-migration-10-to-11'
import { alphaProfileMigration11To12 } from './alpha-profile-migration-11-to-12'
import { alphaProfileMigration12To13 } from './alpha-profile-migration-12-to-13'
import { alphaProfileMigration13To14 } from './alpha-profile-migration-13-to-14'
import { alphaProfileMigration14To15 } from './alpha-profile-migration-14-to-15'
import { alphaProfileMigration15To16 } from './alpha-profile-migration-15-to-16'
import { alphaProfileMigration16To17 } from './alpha-profile-migration-16-to-17'
import { alphaProfileMigration17To18 } from './alpha-profile-migration-17-to-18'
import { alphaProfileMigration18To19 } from './alpha-profile-migration-18-to-19'
import { alphaProfileMigration19To20 } from './alpha-profile-migration-19-to-20'
import { alphaProfileMigration2To3 } from './alpha-profile-migration-2-to-3'
import { alphaProfileMigration20To21 } from './alpha-profile-migration-20-to-21'
import { alphaProfileMigration21To22 } from './alpha-profile-migration-21-to-22'
import { alphaProfileMigration22To23 } from './alpha-profile-migration-22-to-23'
import { alphaProfileMigration23To24 } from './alpha-profile-migration-23-to-24'
import { alphaProfileMigration24To25 } from './alpha-profile-migration-24-to-25'
import { alphaProfileMigration25To26 } from './alpha-profile-migration-25-to-26'
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
    // ^^^ release 1.0.2 ^^^
    15: alphaProfileMigration15To16,
    16: alphaProfileMigration16To17,
    17: alphaProfileMigration17To18,
    18: alphaProfileMigration18To19,
    // ^^^ release 1.0.3 ^^^
    19: alphaProfileMigration19To20,
    20: alphaProfileMigration20To21,
    // ^^^ release 1.0.4 ^^^
    21: alphaProfileMigration21To22,
    // ^^^ release 1.0.8 ^^^
    22: alphaProfileMigration22To23,
    // ^^^ release 1.1.2 ^^^
    23: alphaProfileMigration23To24,
    // ^^^ release 1.1.3 ^^^
    24: alphaProfileMigration24To25,
    25: alphaProfileMigration25To26,
}
