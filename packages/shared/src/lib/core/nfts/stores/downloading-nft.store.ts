import { writable } from 'svelte/store'

export const downloadingNft = writable<{ nftId: string; progress: number } | undefined>(undefined)
