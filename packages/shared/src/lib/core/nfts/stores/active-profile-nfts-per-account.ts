import { get, writable } from 'svelte/store'

import { Nft } from '../interfaces'

export const activeProfileNftsPerAccount = writable<Nft[][]>([])

export function clearAccountNfts(): void {
    activeProfileNftsPerAccount.set([])
}

export function getAllAccountNfts(): Nft[][] {
    return get(activeProfileNftsPerAccount)
}
