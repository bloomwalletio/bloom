import { derived, get, Readable } from 'svelte/store'

import { activeProfile } from '@core/profile/stores'
import { persistent } from '@core/utils/store'

import { IPersistedNft, IPersistedNfts } from '../interfaces'

export const persistedNfts = persistent<IPersistedNfts>('persistedNfts', {})

export const persistedNftForActiveProfile: Readable<{ [nftId: string]: IPersistedNft }> = derived(
    [persistedNfts, activeProfile],
    ([$persistedNfts, $activeProfile]) => $persistedNfts[$activeProfile?.id]
)

export function addPersistedNft(nftId: string, newPersistedNft: IPersistedNft): void {
    persistedNfts.update((state) => {
        if (!state[get(activeProfile)?.id]) {
            state[get(activeProfile)?.id] = {}
        }
        state[get(activeProfile)?.id][nftId] = newPersistedNft
        return state
    })
}

export function updatePersistedNft(nftId: string, payload: Partial<IPersistedNft>): void {
    persistedNfts.update((state) => {
        if (!state[get(activeProfile)?.id]) {
            state[get(activeProfile)?.id] = {}
        }
        const nftState = state[get(activeProfile)?.id][nftId]
        state[get(activeProfile)?.id][nftId] = {
            ...nftState,
            ...payload,
        }
        return state
    })
}

export function removePersistedNftsForProfile(profileId: string): void {
    persistedNfts.update((state) => {
        delete state[profileId]
        return state
    })
}
