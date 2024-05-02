import { get, writable } from 'svelte/store'

import { Nft } from '../interfaces'

export const activeProfileNftsPerAccount = writable<{ [accountIndex: number]: Nft[] }>({})

export function clearAccountNfts(): void {
    activeProfileNftsPerAccount.set({})
}

export function getAllAccountNfts(): { [accountIndex: number]: Nft[] } {
    return get(activeProfileNftsPerAccount)
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
            const _nft = state[accountIndex].find((_nft) => _nft.id === nft.id)
            if (_nft) {
                Object.assign(_nft, nft)
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

export function updateNftsForAccount(accountIndex: number, nfts: (Partial<Nft> & { id: string })[]): void {
    activeProfileNftsPerAccount.update((state) => {
        if (!state[accountIndex]) {
            state[accountIndex] = []
        }

        for (const nft of nfts) {
            const _nft = state[accountIndex].find((_nft) => _nft.id === nft.id)
            if (_nft) {
                Object.assign(_nft, nft)
            }
        }
        return state
    })
}

export function updateNftForAccount(accountIndex: number, nft: Partial<Nft> & { id: string }): void {
    updateNftsForAccount(accountIndex, [nft])
}

export function getNftByIdForAccount(accountIndex: number | undefined, nftId: string): Nft | undefined {
    return accountIndex
        ? getNftsForAccount(accountIndex)?.find((_nft) => _nft.id?.toLowerCase() === nftId?.toLowerCase())
        : undefined
}
