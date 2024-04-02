import { fireflyShimmerProfileMigrationToV10, fireflyShimmerProfileMigrationToV11, fireflyShimmerProfileMigrationToV12, fireflyShimmerProfileMigrationToV13, fireflyShimmerProfileMigrationToV14, fireflyShimmerProfileMigrationToV4, fireflyShimmerProfileMigrationToV5, fireflyShimmerProfileMigrationToV6, fireflyShimmerProfileMigrationToV7, fireflyShimmerProfileMigrationToV8, fireflyShimmerProfileMigrationToV9 } from './firefly-shimmer-migrations'

export const FIREFLY_SHIMMER_PROFILE_MIGRATION_MAP: Record<number, (existingProfile: unknown) => void> = {
    3: fireflyShimmerProfileMigrationToV4,
    4: fireflyShimmerProfileMigrationToV5,
    5: fireflyShimmerProfileMigrationToV6,
    6: fireflyShimmerProfileMigrationToV7,
    7: fireflyShimmerProfileMigrationToV8,
    8: fireflyShimmerProfileMigrationToV9,
    9: fireflyShimmerProfileMigrationToV10,
    10: fireflyShimmerProfileMigrationToV11,
    11: fireflyShimmerProfileMigrationToV12,
    12: fireflyShimmerProfileMigrationToV13,
    13: fireflyShimmerProfileMigrationToV14,
}
