import { get } from 'svelte/store'
import { updateNftInAllAccountNfts } from '.'
import { Nft } from '../interfaces'
import { addNftToDownloadQueue, nftDownloadQueue, updatePersistedNft } from '../stores'
import { checkIfNftShouldBeDownloaded } from '../utils/checkIfNftShouldBeDownloaded'
import { NftDownloadOptions } from '../types'

export async function addNftsToDownloadQueue(nfts: Nft[], options?: Partial<NftDownloadOptions>): Promise<void> {
    if (nfts.length === 0) {
        return
    }

    const fullOptions: NftDownloadOptions = { skipDownloadSettingsCheck: false, skipSizeCheck: false, ...options }
    const nftsToAdd: Nft[] = []
    for (const nft of nfts) {
        const isNftInDownloadQueue = get(nftDownloadQueue).some((queueItem) => queueItem.nft.id === nft.id)
        if (isNftInDownloadQueue || nft.isLoaded) {
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
