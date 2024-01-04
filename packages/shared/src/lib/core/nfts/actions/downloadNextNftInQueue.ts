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
        const { downloadUrl, filePath } = nft.downloadMetadata ?? {}
        if (downloadUrl && filePath) {
            console.log('download', downloadUrl, 'to', filePath)
            await Platform.downloadNft(downloadUrl, filePath, nft.id, accountIndex)
        }
    } catch (error) {
        downloadingNftId.set(undefined)
        removeNftFromDownloadQueue(get(downloadingNftId))
    }
}
