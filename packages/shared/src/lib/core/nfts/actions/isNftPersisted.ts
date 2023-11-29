import { persistedNftForActiveProfile } from '@core/nfts/stores'
import { get } from 'svelte/store'

export function isNftPersisted(nftId: string, tokenId?: string): boolean {
    return get(persistedNftForActiveProfile)?.[nftId + tokenId ?? '0'] !== undefined
}
