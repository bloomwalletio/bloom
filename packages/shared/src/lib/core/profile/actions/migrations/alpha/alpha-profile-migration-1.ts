import { removeProfileFolder } from '@core/profile/utils'

export async function alphaProfileMigration1(existingProfile: unknown): Promise<void> {
    const profileId = (existingProfile as { id?: string })?.id
    if (profileId) {
        await removeProfileFolder(profileId)
    }
}
