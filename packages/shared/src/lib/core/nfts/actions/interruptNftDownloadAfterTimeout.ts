import { Platform } from '@core/app/classes'
import { MILLISECONDS_PER_SECOND, sleep } from '@core/utils'
import { get } from 'svelte/store'
import { DownloadWarningType } from '../enums'
import { downloadingNftId, getNftByIdForAccount, removeNftFromDownloadQueue, updateNftForAllAccounts } from '../stores'
import { activeProfile } from '@core/profile/stores'

export async function interruptNftDownloadAfterTimeout(
    accountIndex: number,
    downloadingNftIdToInterrupt: string
): Promise<void> {
    if (!downloadingNftIdToInterrupt) {
        return
    }

    const downloadTimeout = get(activeProfile).settings.nfts.maxMediaDownloadTimeInSeconds * MILLISECONDS_PER_SECOND
    await sleep(downloadTimeout)
    const updatedDownloadingNft = get(downloadingNftId)

    if (downloadingNftIdToInterrupt === updatedDownloadingNft) {
        removeNftFromDownloadQueue(downloadingNftIdToInterrupt)
        await Platform.cancelNftDownload(downloadingNftIdToInterrupt)
        const nft = getNftByIdForAccount(accountIndex, downloadingNftIdToInterrupt)
        if (nft) {
            updateNftForAllAccounts({
                id: downloadingNftIdToInterrupt,
                isLoaded: false,
                downloadMetadata: {
                    ...nft.downloadMetadata,
                    error: undefined,
                    warning: { type: DownloadWarningType.DownloadTooLong },
                },
            })
        }
    }
}
