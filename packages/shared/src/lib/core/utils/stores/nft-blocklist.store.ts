import { writable } from 'svelte/store'
import { NftBlocklist } from '../interfaces/nft-blocklist.interface'

export const nftBlocklist = writable<NftBlocklist>({ urls: [], keywords: [] })
