import { get, writable } from 'svelte/store'

import { Nft } from '../interfaces'
import { PartialWithId } from '@core/utils'

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

export function setNftsForAccount(accountIndex: number, nfts: Nft[]): void {
    activeProfileNftsPerAccount.update((state) => {
        state[accountIndex] = nfts
        return state
    })
}

export function addOrUpdateNftsForAccount(accountIndex: number, nfts: Nft[]): void {
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
            }
        }
        return state
    })
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
    for (const accountIndex of Object.keys(get(activeProfileNftsPerAccount)) as unknown as number[]) {
        updateNftForAccount(accountIndex, partialNft)
    }
}

export function getNftByIdForAccount(accountIndex: number | undefined, nftId: string): Nft | undefined {
    if (typeof accountIndex === 'number' && accountIndex >= 0) {
        const nft = getNftsForAccount(accountIndex)?.find((nft) => nft.id?.toLowerCase() === nftId?.toLowerCase())
        return nft
    }
}
