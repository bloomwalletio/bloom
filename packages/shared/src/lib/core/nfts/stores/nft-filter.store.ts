import { Writable, writable } from 'svelte/store'
import { INftFilter } from '../interfaces/nft-filter.interface'
import { DEFAULT_NFT_FILTER } from '../constants'

export const nftFilter: Writable<INftFilter> = writable(DEFAULT_NFT_FILTER)
