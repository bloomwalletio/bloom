import { IPersistedProfile } from '@core/profile/interfaces'
import { persistedTokens } from '@core/token/stores'

export function alphaProfileMigration16To17(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    persistedTokens.update((state) => {
        delete state[profile.id]
        return state
    })
    return Promise.resolve()
}
