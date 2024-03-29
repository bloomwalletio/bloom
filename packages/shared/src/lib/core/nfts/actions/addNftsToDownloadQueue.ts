import { get } from 'svelte/store'
import { updateNftInAllAccountNfts } from '.'
import { Nft } from '../interfaces'
import { addNftToDownloadQueue, nftDownloadQueue, updatePersistedNft } from '../stores'
import { checkIfNftShouldBeDownloaded } from '../utils/checkIfNftShouldBeDownloaded'

export async function addNftsToDownloadQueue(nfts: Nft[], forceDownload: boolean = true): Promise<void> {
    if (nfts.length === 0) {
        return
    }

    const nftsToAdd: Nft[] = []
    for (const nft of nfts) {
        const isNftInDownloadQueue = get(nftDownloadQueue).some((nftInQueue) => nftInQueue.id === nft.id)
        if (isNftInDownloadQueue) {
            continue
        }

        const shouldNotDownloadNft = nft.isLoaded || !!nft.downloadMetadata?.error || !!nft.downloadMetadata?.warning
        if (shouldNotDownloadNft && !forceDownload) {
            continue
        } else {
            const nftToAdd = await validateNft(nft)
            if (nftToAdd) {
                nftsToAdd.push(nftToAdd)
            }
        }
    }

    for (const nft of nftsToAdd) {
        addNftToDownloadQueue(nft)
    }
}

async function validateNft(nft: Nft): Promise<Nft | undefined> {
    try {
        const { shouldDownload, downloadMetadata, isLoaded } = await checkIfNftShouldBeDownloaded(nft)
        updatePersistedNft(nft.id, { downloadMetadata })
        updateNftInAllAccountNfts(nft.id, { downloadMetadata, isLoaded })

        if (shouldDownload) {
            return nft
        }
    } catch (error) {
        console.error(error)
    }
}
