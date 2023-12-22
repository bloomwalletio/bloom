import { Platform } from '@core/app/classes'
import { get } from 'svelte/store'
import { downloadingNftId, nftDownloadQueue, removeNftFromDownloadQueue } from '../stores'

export async function downloadNextNftInQueue(): Promise<void> {
    const nextDownload = get(nftDownloadQueue)?.[0]
    if (!nextDownload || get(downloadingNftId)) {
        return
    }

    const { nft, accountIndex } = nextDownload
    if (!nft.downloadMetadata.downloadUrl || !nft.downloadMetadata.filePath) {
        removeNftFromDownloadQueue(nft.id)
        return
    }

    try {
        downloadingNftId.set(nft.id)
        await Platform.downloadNft(
            nft.downloadMetadata.downloadUrl,
            nft.downloadMetadata.filePath,
            nft.id,
            accountIndex
        )
    } catch (err) {
        downloadingNftId.set(undefined)
        removeNftFromDownloadQueue(nft.id)
    }
}
