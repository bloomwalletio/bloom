import { get } from 'svelte/store'
import { persistedNftForActiveProfile } from '../stores'

export function isNftPersisted(nftId: string, tokenId: string): boolean {
    return `${nftId}:${tokenId}` in (get(persistedNftForActiveProfile) ?? {})
}
