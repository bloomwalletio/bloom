import { downloadingNftId, removeNftFromDownloadQueue, updateNftForAllAccounts } from '@core/nfts/stores'
import { Platform } from '../classes'

/**
 * Registers all event handlers for nft downloads.
 */
export function registerNftDownloadEvents(): void {
    Platform.onEvent('nft-download-done', ({ nftId }) => {
        updateNftForAllAccounts({ id: nftId, isLoaded: true })
        removeNftFromDownloadQueue(nftId)
        downloadingNftId.set(undefined)
    })
    Platform.onEvent('nft-download-interrupted', ({ nftId }) => {
        removeNftFromDownloadQueue(nftId)
        downloadingNftId.set(undefined)
    })
}
