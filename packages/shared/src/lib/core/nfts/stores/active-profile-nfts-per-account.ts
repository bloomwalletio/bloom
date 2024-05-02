import { get, writable } from 'svelte/store'

import { Nft } from '../interfaces'

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

export function updateNftsForAccount(accountIndex: number, partialNfts: (Partial<Nft> & { id: string })[]): void {
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

export function updateNftForAccount(accountIndex: number, partialNft: Partial<Nft> & { id: string }): void {
    updateNftsForAccount(accountIndex, [partialNft])
}

export function updateNftForAllAccounts(partialNft: Partial<Nft> & { id: string }): void {
    for (const accountIndex of Object.keys(get(activeProfileNftsPerAccount)) as unknown as number[]) {
        updateNftForAccount(accountIndex, partialNft)
    }
}

export function getNftByIdForAccount(accountIndex: number | undefined, nftId: string): Nft | undefined {
    return accountIndex
        ? getNftsForAccount(accountIndex)?.find((nft) => nft.id?.toLowerCase() === nftId?.toLowerCase())
        : undefined
}
