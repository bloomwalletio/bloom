import { derived, Readable } from 'svelte/store'

import { activeProfile, getActiveProfileId } from '@core/profile/stores'
import { persistent } from '@core/utils/store'

import { IPersistedNfts } from '../interfaces'
import { PersistedNft } from '../types'
import { PartialWithId } from '@core/utils/types'

export const persistedNfts = persistent<IPersistedNfts>('persistedNfts', {})

export const persistedNftForActiveProfile: Readable<{ [nftId: string]: PersistedNft }> = derived(
    [persistedNfts, activeProfile],
    ([$persistedNfts, $activeProfile]) => $persistedNfts[$activeProfile?.id]
)

export function addPersistedNft(nftId: string, newPersistedNft: PersistedNft): void {
    const profileId = getActiveProfileId()
    persistedNfts.update((state) => {
        if (!state[profileId]) {
            state[profileId] = {}
        }
        state[profileId][nftId] = newPersistedNft
        return state
    })
}

export function updatePersistedNfts(nftsToUpdate: PartialWithId<PersistedNft>[]): void {
    const profileId = getActiveProfileId()
    persistedNfts.update((state) => {
        if (!state[profileId]) {
            state[profileId] = {}
        }
        for (const partialNft of nftsToUpdate) {
            const nftState = state[profileId][partialNft.id]
            state[profileId][partialNft.id] = {
                ...nftState,
                ...partialNft,
            } as PersistedNft
        }
        return state
    })
}

export function updatePersistedNft(nftId: string, payload: Partial<PersistedNft>): void {
    const profileId = getActiveProfileId()
    persistedNfts.update((state) => {
        if (!state[profileId]) {
            state[profileId] = {}
        }
        const nftState = state[profileId][nftId]
        state[profileId][nftId] = {
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
