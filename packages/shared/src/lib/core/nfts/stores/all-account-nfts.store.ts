import { get, writable } from 'svelte/store'

import { INft } from '../interfaces'

export const allAccountNfts = writable<INft[][]>([])

export function clearAccountNfts(): void {
    allAccountNfts.set([])
}

export function getAllAccountNfts(): INft[][] {
    return get(allAccountNfts)
}
