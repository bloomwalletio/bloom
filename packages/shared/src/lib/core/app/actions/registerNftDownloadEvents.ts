import { updateNftInAllAccountNfts } from '@core/nfts/actions'
import { downloadingNftId, removeNftFromDownloadQueue } from '@core/nfts/stores'
import { Platform } from '../classes'

/**
 * Registers all event handlers for nft downloads.
 */
export function registerNftDownloadEvents(): void {
    Platform.onEvent('nft-download-done', ({ nftId, accountIndex }) => {
        updateNftInAllAccountNfts(accountIndex, nftId, { isLoaded: true })
        removeNftFromDownloadQueue(nftId)
        downloadingNftId.set(undefined)
    })
    Platform.onEvent('nft-download-interrupted', ({ nftId }) => {
        removeNftFromDownloadQueue(nftId)
        downloadingNftId.set(undefined)
    })
}
