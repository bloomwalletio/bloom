import { ProfileMigrationMap } from '../../types'
import { alphaProfileMigration0To1 } from './alpha-profile-migration-0-to-1'
import { alphaProfileMigration1To2 } from './alpha-profile-migration-1-to-2'
import { alphaProfileMigration2To3 } from './alpha-profile-migration-2-to-3'
import { alphaProfileMigration3To4 } from './alpha-profile-migration-3-to-4'

export const ALPHA_PROFILE_MIGRATION_MAP: ProfileMigrationMap = {
    0: alphaProfileMigration0To1,
    1: alphaProfileMigration1To2,
    2: alphaProfileMigration2To3,
    3: alphaProfileMigration3To4,
}
