import {
    fireflyStardustProfileMigrationToV10,
    fireflyStardustProfileMigrationToV11,
    fireflyStardustProfileMigrationToV12,
    fireflyStardustProfileMigrationToV13,
    fireflyStardustProfileMigrationToV14,
    fireflyStardustProfileMigrationToV4,
    fireflyStardustProfileMigrationToV5,
    fireflyStardustProfileMigrationToV6,
    fireflyStardustProfileMigrationToV7,
    fireflyStardustProfileMigrationToV8,
    fireflyStardustProfileMigrationToV9,
} from './firefly-stardust-migrations'

export const FIREFLY_STARDUST_PROFILE_MIGRATION_MAP: Record<number, (existingProfile: unknown) => void> = {
    3: fireflyStardustProfileMigrationToV4,
    4: fireflyStardustProfileMigrationToV5,
    5: fireflyStardustProfileMigrationToV6,
    6: fireflyStardustProfileMigrationToV7,
    7: fireflyStardustProfileMigrationToV8,
    8: fireflyStardustProfileMigrationToV9,
    9: fireflyStardustProfileMigrationToV10,
    10: fireflyStardustProfileMigrationToV11,
    11: fireflyStardustProfileMigrationToV12,
    12: fireflyStardustProfileMigrationToV13,
    13: fireflyStardustProfileMigrationToV14,
}
