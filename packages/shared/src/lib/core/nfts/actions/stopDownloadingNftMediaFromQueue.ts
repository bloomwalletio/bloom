import { Platform } from '@core/app/classes'
import { get } from 'svelte/store'
import { downloadingNft, resetNftDownloadQueue } from '../stores'

export async function stopDownloadingNftMediaFromQueue(): Promise<void> {
    resetNftDownloadQueue()
    const currentlyDownloadingNftId = get(downloadingNft)?.nftId
    if (currentlyDownloadingNftId) {
        await Platform.cancelNftDownload(currentlyDownloadingNftId)
        downloadingNft.set(undefined)
    }
}
