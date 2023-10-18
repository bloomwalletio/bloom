import { removeProfileFolder } from '../../utils'

export async function alphaProfileMigration0To1(existingProfile: unknown): Promise<void> {
    const profileId = (existingProfile as { id?: string })?.id
    if (profileId) {
        await removeProfileFolder(profileId)
    }
}
