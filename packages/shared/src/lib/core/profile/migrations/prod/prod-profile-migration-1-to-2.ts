import { persistedNfts } from '@core/nfts/stores'

export function prodProfileMigration1To2(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as { id: string }

    persistedNfts.update((state) => {
        state[profile.id] = {}
        return state
    })

    return Promise.resolve()
}
