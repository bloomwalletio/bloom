import { derived, get, Readable } from 'svelte/store'

import { activeProfile } from '@core/profile/stores'
import { persistent } from '@core/utils/store'

import { IPersistedNftMetadata, IPersistedNftStore } from '../interfaces'

export const persistedNfts = persistent<IPersistedNftStore>('persistedNfts', {})

export const persistedNftForActiveProfile: Readable<{ [nftId: string]: IPersistedNftMetadata }> = derived(
    [persistedNfts, activeProfile],
    ([$persistedNfts, $activeProfile]) => $persistedNfts[$activeProfile?.id]
)

export function addPersistedNft(nftId: string, newPersistedNft: IPersistedNftMetadata): void {
    persistedNfts.update((state) => {
        if (!state[get(activeProfile)?.id]) {
            state[get(activeProfile)?.id] = {}
        }
        state[get(activeProfile)?.id][nftId] = newPersistedNft
        return state
    })
}

export function removePersistedNftsForProfile(profileId: string): void {
    persistedNfts.update((state) => {
        delete state[profileId]
        return state
    })
}
