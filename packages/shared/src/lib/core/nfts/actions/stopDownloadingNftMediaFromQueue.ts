import { Platform } from '@core/app/classes'
import { get } from 'svelte/store'
import { downloadingNftId, resetNftDownloadQueue } from '../stores'

export async function stopDownloadingNftMediaFromQueue(): Promise<void> {
    resetNftDownloadQueue()
    const currentlyDownloadingNftId = get(downloadingNftId)
    if (currentlyDownloadingNftId) {
        await Platform.cancelNftDownload(currentlyDownloadingNftId)
        downloadingNftId.set(undefined)
    }
}
