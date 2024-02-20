import { updatePersistedNftIdsToLowercase } from '../actions/updatePersistedNftIdsToLowercase'

export function alphaProfileMigration5To6(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as { id: string }

    try {
        updatePersistedNftIdsToLowercase(profile.id)
    } catch (error) {
        return Promise.reject()
    }

    return Promise.resolve()
}
