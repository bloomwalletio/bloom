import { get, writable } from 'svelte/store'
import { INft } from '../interfaces'
import { downloadingNft } from './downloading-nft.store'

export const nftDownloadQueue = writable<INft[]>([])

export function addNftToDownloadQueue(nft: INft): void {
    nftDownloadQueue.update((state) => {
        if (!state.some((nft2) => nft2.id === nft.id)) {
            state = [...state, nft]
        }
        return state
    })
}

export function removeNftFromDownloadQueue(nftId: string): void {
    nftDownloadQueue.update((state) => state.filter((nft) => nft.id !== nftId))
}

export function resetNftDownloadQueue(keepCurrentlyDownloadingNft: boolean = false): void {
    if (keepCurrentlyDownloadingNft) {
        nftDownloadQueue.update((state) => state.filter((nft) => nft.id === get(downloadingNft)?.nftId))
    } else {
        nftDownloadQueue.set([])
    }
}
