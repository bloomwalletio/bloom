import { get, writable } from 'svelte/store'
import { Nft } from '../interfaces'
import { downloadingNftId } from './downloading-nft.store'
import { NftDownloadOptions } from '../types'

export const nftDownloadQueue = writable<{ nft: Nft; options: NftDownloadOptions }[]>([])

export function addNftToDownloadQueue(nft: Nft, options: NftDownloadOptions): void {
    const isNftInDownloadQueue = get(nftDownloadQueue).some((nftInQueue) => nftInQueue.nft.id === nft.id)
    if (isNftInDownloadQueue) {
        return
    }

    nftDownloadQueue.update((state) => {
        return [...state, { nft, options }]
    })
}

export function removeNftFromDownloadQueue(nftId: string): void {
    const isNftInDownloadQueue = get(nftDownloadQueue).some((nftInQueue) => nftInQueue.nft.id === nftId)
    if (!isNftInDownloadQueue) {
        return
    }

    nftDownloadQueue.update((state) => {
        return state.filter((queueItem) => queueItem.nft.id !== nftId)
    })
}

export function resetNftDownloadQueue(keepCurrentlyDownloadingNft: boolean = false): void {
    if (keepCurrentlyDownloadingNft) {
        nftDownloadQueue.update((state) => state.filter((queueItem) => queueItem.nft.id === get(downloadingNftId)))
    } else {
        nftDownloadQueue.set([])
    }
}
