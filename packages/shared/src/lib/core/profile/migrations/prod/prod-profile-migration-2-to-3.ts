import { updatePersistedNftIdsToLowercase } from '../actions/updatePersistedNftIdsToLowercase'

export function prodProfileMigration2To3(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as { id: string }

    try {
        updatePersistedNftIdsToLowercase(profile.id)
    } catch (error) {
        return Promise.reject()
    }

    return Promise.resolve()
}
