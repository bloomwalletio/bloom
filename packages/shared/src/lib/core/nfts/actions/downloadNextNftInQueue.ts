import { Platform } from '@core/app/classes'
import { get } from 'svelte/store'
import { downloadingNftId, nftDownloadQueue, removeNftFromDownloadQueue } from '../stores'

export async function downloadNextNftInQueue(): Promise<void> {
    if (get(downloadingNftId)) {
        return
    }

    const nextNftToDownload = get(nftDownloadQueue)?.[0]
    if (!nextNftToDownload) {
        return
    }
    downloadingNftId.set(nextNftToDownload.id)

    if (!nextNftToDownload.downloadMetadata?.downloadUrl || !nextNftToDownload.downloadMetadata?.filePath) {
        removeNftFromDownloadQueue(nextNftToDownload.id)
        downloadingNftId.set(undefined)
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
        downloadingNftId.set(undefined)
    }
}
