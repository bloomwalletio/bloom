import { get, writable } from 'svelte/store'

import { Nft } from '../interfaces'

export const allAccountNfts = writable<Nft[][]>([])

export function clearAccountNfts(): void {
    allAccountNfts.set([])
}

export function getAllAccountNfts(): Nft[][] {
    return get(allAccountNfts)
}
