import { get } from 'svelte/store'
import { DEFAULT_NFT_TOKEN_ID } from '../constants'
import { persistedNftForActiveProfile } from '../stores'

export function isNftPersisted(nftId: string, tokenId?: string): boolean {
    return `${nftId}:${tokenId ?? DEFAULT_NFT_TOKEN_ID}` in get(persistedNftForActiveProfile)
}
