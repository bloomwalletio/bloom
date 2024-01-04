import { Platform } from '@core/app/classes'
import { get } from 'svelte/store'
import { downloadingNftId, nftDownloadQueue, removeNftFromDownloadQueue } from '../stores'

export async function downloadNextNftInQueue(): Promise<void> {
    if (get(downloadingNftId)) {
        return
    }

    const nextDownload = get(nftDownloadQueue)?.[0]
    if (!nextDownload) {
        return
    }
    const { nft, accountIndex } = nextDownload
    downloadingNftId.set(nft.id)

    if (!nft.downloadMetadata.downloadUrl || !nft.downloadMetadata.filePath) {
        removeNftFromDownloadQueue(nft.id)
        downloadingNftId.set(undefined)
        return
    }

    try {
        await Platform.downloadNft(
            nft.downloadMetadata.downloadUrl,
            nft.downloadMetadata.filePath,
            nft.id,
            accountIndex
        )
    } catch (err) {
        removeNftFromDownloadQueue(nft.id)
        downloadingNftId.set(undefined)
    }
}
