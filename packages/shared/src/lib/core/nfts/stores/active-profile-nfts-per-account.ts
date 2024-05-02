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

export function updateNftsForAccount(accountIndex: number, nfts: Nft[]): void {
    activeProfileNftsPerAccount.update((state) => {
        state[accountIndex] = [...state[accountIndex], ...nfts]
        return state
    })
}

export function getNftByIdForAccount(accountIndex: number | undefined, nftId: string): Nft | undefined {
    return accountIndex
        ? getNftsForAccount(accountIndex)?.find((_nft) => _nft.id?.toLowerCase() === nftId?.toLowerCase())
        : undefined
}
