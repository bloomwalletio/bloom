import { updateNftInAllAccountNfts } from '.'
import { INft } from '../interfaces'
import { addNftToDownloadQueue, updatePersistedNft } from '../stores'
import { checkIfNftShouldBeDownloaded } from '../utils/checkIfNftShouldBeDownloaded'

export async function addNftsToDownloadQueue(
    accountIndex: number,
    nfts: INft[],
    forceDownload: boolean = true
): Promise<void> {
    const nftsToAdd: INft[] = []
    for (const nft of nfts) {
        const shouldNotDownloadNft = nft.isLoaded || !!nft.downloadMetadata?.error || !!nft.downloadMetadata?.warning
        if (shouldNotDownloadNft && !forceDownload) {
            continue
        } else {
            const nftToAdd = await validateNft(accountIndex, nft)
            if (nftToAdd) {
                nftsToAdd.push(nftToAdd)
            }
        }
    }

    for (const nft of nftsToAdd) {
        addNftToDownloadQueue({ accountIndex, nft })
    }
}

async function validateNft(accountIndex: number, nft: INft): Promise<undefined | INft> {
    try {
        const { shouldDownload, downloadMetadata, isLoaded } = await checkIfNftShouldBeDownloaded(nft)
        updatePersistedNft(nft.id, { downloadMetadata })
        updateNftInAllAccountNfts(accountIndex, nft.id, { downloadMetadata, isLoaded })

        if (shouldDownload) {
            return nft
        }
    } catch (error) {
        console.error(error)
    }
}
