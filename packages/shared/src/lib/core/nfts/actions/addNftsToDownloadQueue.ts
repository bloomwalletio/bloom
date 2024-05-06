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
    const nftsToAdd: { nft: Nft; shouldDownload: boolean }[] = []
    for (const nft of nfts) {
        const isNftInDownloadQueue = get(nftDownloadQueue).some((queueItem) => queueItem.nft.id === nft.id)
        if (isNftInDownloadQueue || nft.isLoaded) {
            continue
        }

        const { shouldDownload, downloadMetadata, isLoaded } = await checkIfNftShouldBeDownloaded(
            nft,
            fullOptions.skipDownloadSettingsCheck
        )

        nftsToAdd.push({ nft: { ...nft, downloadMetadata, isLoaded }, shouldDownload })
    }

    updatePersistedNfts(nftsToAdd.map(({ nft }) => ({ id: nft.id, downloadMetadata: nft.downloadMetadata })))
    updateNftsForAllAccounts(
        nftsToAdd.map(({ nft }) => ({ id: nft.id, downloadMetadata: nft.downloadMetadata, isLoaded: nft.isLoaded }))
    )

    nftDownloadQueue.update((state) => {
        for (const nft of nftsToAdd) {
            if (!nft.shouldDownload) {
                state.push({ nft: nft.nft, options: fullOptions })
            }
        }
        return state
    })
}
