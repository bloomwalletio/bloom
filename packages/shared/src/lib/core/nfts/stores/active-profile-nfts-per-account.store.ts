import { get, writable } from 'svelte/store'

import { Nft } from '../interfaces'
import { PartialWithId } from '@core/utils'
import { updatePersistedCollections } from '../actions'
import { NetworkId } from '@core/network'

export const activeProfileNftsPerAccount = writable<{ [accountIndex: number]: Nft[] }>({})

export function clearActiveProfileNftsPerAccount(): void {
    activeProfileNftsPerAccount.set({})
}

export function getAllNftsForActiveProfile(): Nft[] {
    return Object.values(get(activeProfileNftsPerAccount)).flat()
}

export function getNftsForAccount(accountIndex: number): Nft[] {
    return get(activeProfileNftsPerAccount)[accountIndex] ?? []
}

export function addOrUpdateNftsForAccount(accountIndex: number, nfts: Nft[]): void {
    const addedNfts: Nft[] = []
    activeProfileNftsPerAccount.update((state) => {
        if (!state[accountIndex]) {
            state[accountIndex] = []
        }

        for (const nft of nfts) {
            const existingNft = state[accountIndex].find((_nft) => _nft.id === nft.id)
            if (existingNft) {
                Object.assign(existingNft, nft)
            } else {
                state[accountIndex].push(nft)
                addedNfts.push(nft)
            }
        }
        return state
    })
    void updatePersistedCollections(addedNfts)
}

export function addOrUpdateNftForAccount(accountIndex: number, nft: Nft): void {
    addOrUpdateNftsForAccount(accountIndex, [nft])
}

export function updateNftsForAccount(accountIndex: number, partialNfts: PartialWithId<Nft>[]): void {
    activeProfileNftsPerAccount.update((state) => {
        if (!state[accountIndex]) {
            state[accountIndex] = []
        }

        for (const partialNft of partialNfts) {
            const existingNft = state[accountIndex].find((nft) => nft.id === partialNft.id)
            if (existingNft) {
                Object.assign(existingNft, partialNft)
            }
        }
        return state
    })
}

export function updateNftForAccount(accountIndex: number, partialNft: PartialWithId<Nft>): void {
    updateNftsForAccount(accountIndex, [partialNft])
}

export function updateNftForAllAccounts(partialNft: PartialWithId<Nft>): void {
    updateNftsForAllAccounts([partialNft])
}

export function updateNftsForAllAccounts(partialNfts: PartialWithId<Nft>[]): void {
    for (const accountIndex of Object.keys(get(activeProfileNftsPerAccount)) as unknown as number[]) {
        updateNftsForAccount(accountIndex, partialNfts)
    }
}

export function getNftByIdForAccount(accountIndex: number | undefined, nftId: string | undefined): Nft | undefined {
    if (nftId && typeof accountIndex === 'number' && accountIndex >= 0) {
        const nft = getNftsForAccount(accountIndex)?.find((nft) => nft.id?.toLowerCase() === nftId?.toLowerCase())
        return nft
    }
}

export function removeAllNftsForNetworkId(networkId: NetworkId): void {
    activeProfileNftsPerAccount.update((state) => {
        const updatedState = {}
        for (const accountIndex in state) {
            updatedState[accountIndex] = state[accountIndex].filter((nft) => nft.networkId !== networkId)
        }
        return updatedState
    })
}
