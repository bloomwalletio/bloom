import { ProfileMigrationMap } from '../../types'
import { alphaProfileMigration0To1 } from './alpha-profile-migration-0-to-1'
import { alphaProfileMigration1To2 } from './alpha-profile-migration-1-to-2'

export const ALPHA_PROFILE_MIGRATION_MAP: ProfileMigrationMap = {
    0: alphaProfileMigration0To1,
    1: alphaProfileMigration1To2,
}
