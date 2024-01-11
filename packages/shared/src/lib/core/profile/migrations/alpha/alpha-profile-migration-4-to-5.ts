import { persistedNfts } from '@core/nfts/stores'

export function alphaProfileMigration4To5(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as { id: string }

    persistedNfts.update((state) => {
        state[profile.id] = {}
        return state
    })

    return Promise.resolve()
}
