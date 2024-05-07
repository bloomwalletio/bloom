import { get } from 'svelte/store'
import { Nft } from '../interfaces'
import { nftDownloadQueue, updateNftsForAllAccounts, updatePersistedNfts } from '../stores'
import { checkIfNftShouldBeDownloaded } from '../utils/checkIfNftShouldBeDownloaded'
import { NftDownloadOptions } from '../types'

export async function addNftsToDownloadQueue(nfts: Nft[], options?: Partial<NftDownloadOptions>): Promise<void> {
    if (nfts.length === 0) {
        return
    }

    const fullOptions: NftDownloadOptions = { skipDownloadSettingsCheck: false, skipSizeCheck: false, ...options }
    const checkedNfts = await validateNftAndCheckIfShouldBeDownloaded(nfts, fullOptions)

    updatePersistedNfts(checkedNfts.map(({ nft }) => ({ id: nft.id, downloadMetadata: nft.downloadMetadata })))
    updateNftsForAllAccounts(
        checkedNfts.map(({ nft }) => ({ id: nft.id, downloadMetadata: nft.downloadMetadata, isLoaded: nft.isLoaded }))
    )

    addNftsToDownloadQueueIfShouldBeDownloaded(checkedNfts, fullOptions)
}

async function validateNftAndCheckIfShouldBeDownloaded(
    nfts: Nft[],
    options: NftDownloadOptions
): Promise<{ nft: Nft; shouldDownload: boolean }[]> {
    const checkedNfts: { nft: Nft; shouldDownload: boolean }[] = []
    for (const nft of nfts) {
        const isNftInDownloadQueue = get(nftDownloadQueue).some((queueItem) => queueItem.nft.id === nft.id)
        if (isNftInDownloadQueue || nft.isLoaded) {
            continue
        }
        try {
            const { shouldDownload, downloadMetadata, isLoaded } = await checkIfNftShouldBeDownloaded(
                nft,
                options.skipDownloadSettingsCheck
            )

            checkedNfts.push({ nft: { ...nft, downloadMetadata, isLoaded }, shouldDownload })
        } catch (error) {
            console.error(error)
        }
    }
    return checkedNfts
}

function addNftsToDownloadQueueIfShouldBeDownloaded(
    nftsToAdd: { nft: Nft; shouldDownload: boolean }[],
    options: NftDownloadOptions
): void {
    nftDownloadQueue.update((state) => {
        for (const nft of nftsToAdd) {
            if (!nft.shouldDownload) {
                state.push({ nft: nft.nft, options })
            }
        }
        return state
    })
}
