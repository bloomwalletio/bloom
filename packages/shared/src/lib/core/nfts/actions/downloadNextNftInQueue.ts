import { Platform } from '@core/app/classes'
import { get } from 'svelte/store'
import { downloadingNft, nftDownloadQueue, removeNftFromDownloadQueue } from '../stores'

export async function downloadNextNftInQueue(): Promise<void> {
    if (get(downloadingNft)) {
        return
    }

    const nextNftToDownload = get(nftDownloadQueue)?.[0]
    if (!nextNftToDownload) {
        return
    }
    downloadingNft.set({ nftId: nextNftToDownload.id, progress: 0 })

    if (!nextNftToDownload.downloadMetadata?.downloadUrl || !nextNftToDownload.downloadMetadata?.filePath) {
        removeNftFromDownloadQueue(nextNftToDownload.id)
        downloadingNft.set(undefined)
        return
    }

    try {
        await Platform.downloadNft(
            nextNftToDownload.downloadMetadata.downloadUrl,
            nextNftToDownload.downloadMetadata.filePath,
            nextNftToDownload.id
        )
    } catch (err) {
        removeNftFromDownloadQueue(nextNftToDownload.id)
        downloadingNft.set(undefined)
    }
}
