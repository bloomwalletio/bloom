import { removeEvmBalanceChanges } from '../actions/removeEvmBalanceChanges'

export function alphaProfileMigration6To7(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as { id: string }

    try {
        removeEvmBalanceChanges(profile.id)
    } catch (error) {
        return Promise.reject()
    }

    return Promise.resolve()
}
