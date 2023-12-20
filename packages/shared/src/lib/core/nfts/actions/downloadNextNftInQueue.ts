import { Platform } from '@core/app/classes'
import { get } from 'svelte/store'
import { downloadingNftId, nftDownloadQueue, removeNftFromDownloadQueue } from '../stores'

export async function downloadNextNftInQueue(): Promise<void> {
    const nextDownload = get(nftDownloadQueue)?.[0]
    if (!nextDownload || get(downloadingNftId)) {
        return
    }

    try {
        const { nft, accountIndex } = nextDownload
        downloadingNftId.set(nft.id)
        if (nft.downloadMetadata.downloadUrl && nft.downloadMetadata.filePath) {
            await Platform.downloadNft(
                nft.downloadMetadata.downloadUrl,
                nft.downloadMetadata.filePath,
                nft.id,
                accountIndex
            )
        } else {
            throw new Error('Missing downloadUrl or filePath for nft')
        }
    } catch (err) {
        downloadingNftId.set(undefined)
        removeNftFromDownloadQueue(get(downloadingNftId))
    }
}
