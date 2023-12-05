import { derived, get, Readable } from 'svelte/store'

import { activeProfile, getActiveProfile } from '@core/profile/stores'
import { persistent } from '@core/utils/store'

import { IPersistedNfts } from '../interfaces'
import { PersistedNft } from '../types'

export const persistedNfts = persistent<IPersistedNfts>('persistedNfts', {})

export const persistedNftForActiveProfile: Readable<{ [nftId: string]: PersistedNft }> = derived(
    [persistedNfts, activeProfile],
    ([$persistedNfts, $activeProfile]) => $persistedNfts[$activeProfile?.id]
)

export function addPersistedNft(nftId: string, newPersistedNft: PersistedNft): void {
    persistedNfts.update((state) => {
        if (!state[get(activeProfile)?.id]) {
            state[get(activeProfile)?.id] = {}
        }
        state[get(activeProfile)?.id][nftId] = newPersistedNft
        return state
    })
}

export function updatePersistedNft(nftId: string, payload: Partial<PersistedNft>): void {
    const profile = getActiveProfile()
    persistedNfts.update((state) => {
        if (!state[profile?.id]) {
            state[profile?.id] = {}
        }
        const nftState = state[profile?.id][nftId]
        state[profile?.id][nftId] = {
            ...nftState,
            ...payload,
        } as PersistedNft
        return state
    })
}

export function removePersistedNftsForProfile(profileId: string): void {
    persistedNfts.update((state) => {
        delete state[profileId]
        return state
    })
}
