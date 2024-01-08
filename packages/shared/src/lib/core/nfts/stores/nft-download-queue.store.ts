import { get, writable } from 'svelte/store'
import { INft } from '../interfaces'
import { downloadingNftId } from './downloading-nft.store'

export const nftDownloadQueue = writable<INft[]>([])

export function addNftToDownloadQueue(nft: INft): void {
    const isNftInDownloadQueue = get(nftDownloadQueue).some((nftInQueue) => nftInQueue.id === nft.id)
    if (isNftInDownloadQueue) {
        return
    }

    nftDownloadQueue.update((state) => {
        return [...state, nft]
    })
}

export function removeNftFromDownloadQueue(nftId: string): void {
    const isNftInDownloadQueue = get(nftDownloadQueue).some((nftInQueue) => nftInQueue.id === nftId)
    if (!isNftInDownloadQueue) {
        return
    }

    nftDownloadQueue.update((state) => {
        return state.filter((nft) => nft.id !== nftId)
    })
}

export function resetNftDownloadQueue(keepCurrentlyDownloadingNft: boolean = false): void {
    if (keepCurrentlyDownloadingNft) {
        nftDownloadQueue.update((state) => state.filter((nft) => nft.id === get(downloadingNftId)))
    } else {
        nftDownloadQueue.set([])
    }
}
