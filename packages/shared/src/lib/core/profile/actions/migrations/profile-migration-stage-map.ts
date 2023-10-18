import { AppStage } from '@core/app'
import { ALPHA_PROFILE_MIGRATION_MAP } from './alpha/alpha-profile-migration-map'
import { BETA_PROFILE_MIGRATION_MAP } from './beta/beta-profile-migration-map'
import { PROD_PROFILE_MIGRATION_MAP } from './prod/prod-profile-migration-map'

export type ProfileMigrationMap = Record<number, (existingProfile: unknown) => Promise<void>>

export const PROFILE_MIGRATION_STAGE_MAP: Record<AppStage, ProfileMigrationMap> = {
    [AppStage.ALPHA]: ALPHA_PROFILE_MIGRATION_MAP,
    [AppStage.BETA]: BETA_PROFILE_MIGRATION_MAP,
    [AppStage.PROD]: PROD_PROFILE_MIGRATION_MAP,
}
