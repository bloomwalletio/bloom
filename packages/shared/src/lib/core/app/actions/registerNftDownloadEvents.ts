import { updateNftInAllAccountNfts } from '@core/nfts/actions'
import { downloadingNft, removeNftFromDownloadQueue } from '@core/nfts/stores'
import { Platform } from '../classes'
import { get } from 'svelte/store'

/**
 * Registers all event handlers for nft downloads.
 */
export function registerNftDownloadEvents(): void {
    Platform.onEvent('nft-download-done', ({ nftId }) => {
        updateNftInAllAccountNfts(nftId, { isLoaded: true })
        removeNftFromDownloadQueue(nftId)
        downloadingNft.set(undefined)
    })
    Platform.onEvent('nft-download-progress', ({ nftId, progress }) => {
        const currentDownloadingNft = get(downloadingNft)
        if (currentDownloadingNft?.nftId === nftId) {
            downloadingNft.set({ nftId, progress })
        }
    })
    Platform.onEvent('nft-download-interrupted', ({ nftId }) => {
        removeNftFromDownloadQueue(nftId)
        downloadingNft.set(undefined)
    })
}
