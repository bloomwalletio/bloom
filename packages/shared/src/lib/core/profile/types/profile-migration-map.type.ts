export type ProfileMigrationMap = Record<number, (existingProfile: unknown) => Promise<void>>
