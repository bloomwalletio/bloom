import { AppStage } from '@core/app'
import { ALPHA_PROFILE_MIGRATION_MAP } from './alpha/'
import { BETA_PROFILE_MIGRATION_MAP } from './beta/'
import { PROD_PROFILE_MIGRATION_MAP } from './prod/'
import { ProfileMigrationMap } from '../types'

export const PROFILE_MIGRATION_STAGE_MAP: Record<AppStage, ProfileMigrationMap> = {
    [AppStage.ALPHA]: ALPHA_PROFILE_MIGRATION_MAP,
    [AppStage.BETA]: BETA_PROFILE_MIGRATION_MAP,
    [AppStage.PROD]: PROD_PROFILE_MIGRATION_MAP,
}
