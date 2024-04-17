import { get } from 'svelte/store'
import { updateNftInAllAccountNfts } from '.'
import { Nft } from '../interfaces'
import { addNftToDownloadQueue, nftDownloadQueue, updatePersistedNft } from '../stores'
import { checkIfNftShouldBeDownloaded } from '../utils/checkIfNftShouldBeDownloaded'
import { NftDownloadQueueOptions } from '../types'

export async function addNftsToDownloadQueue(nfts: Nft[], options?: Partial<NftDownloadQueueOptions>): Promise<void> {
    if (nfts.length === 0) {
        return
    }

    const fullOptions: NftDownloadQueueOptions = { skipDownloadSettingsCheck: false, skipSizeCheck: false, ...options }
    const nftsToAdd: Nft[] = []
    for (const nft of nfts) {
        const isNftInDownloadQueue = get(nftDownloadQueue).some((queueItem) => queueItem.nft.id === nft.id)
        if (isNftInDownloadQueue) {
            continue
        }

        const nftToAdd = await validateNft(nft, fullOptions.skipDownloadSettingsCheck)
        if (nftToAdd) {
            nftsToAdd.push(nftToAdd)
        }
    }

    for (const nft of nftsToAdd) {
        addNftToDownloadQueue(nft, fullOptions)
    }
}

async function validateNft(nft: Nft, skipDownloadSettingsCheck: boolean): Promise<Nft | undefined> {
    try {
        const { shouldDownload, downloadMetadata, isLoaded } = await checkIfNftShouldBeDownloaded(
            nft,
            skipDownloadSettingsCheck
        )
        updatePersistedNft(nft.id, { downloadMetadata })
        updateNftInAllAccountNfts(nft.id, { downloadMetadata, isLoaded })

        if (shouldDownload) {
            return nft
        }
    } catch (error) {
        console.error(error)
    }
}
