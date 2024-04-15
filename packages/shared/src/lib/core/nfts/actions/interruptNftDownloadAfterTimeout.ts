import { Platform } from '@core/app/classes'
import { MILLISECONDS_PER_SECOND, sleep } from '@core/utils'
import { get } from 'svelte/store'
import { DownloadWarningType } from '../enums'
import { downloadingNftId, removeNftFromDownloadQueue } from '../stores'
import { updateNftInAllAccountNfts } from './updateNftInAllAccountNfts'
import { activeProfile } from '@core/profile/stores'
import { getNftByIdFromAllAccountNfts } from './getNftByIdFromAllAccountNfts'

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
        const nft = getNftByIdFromAllAccountNfts(accountIndex, downloadingNftIdToInterrupt)
        if (nft) {
            updateNftInAllAccountNfts(downloadingNftIdToInterrupt, {
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
