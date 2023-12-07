import { get } from 'svelte/store'
import { persistedNftForActiveProfile } from '../stores'

export function isNftPersisted(nftId: string): boolean {
    return nftId in (get(persistedNftForActiveProfile) ?? {})
}
