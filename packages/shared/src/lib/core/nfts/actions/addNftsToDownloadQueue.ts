import { updateNftInAllAccountNfts } from '.'
import { Nft } from '../interfaces'
import { addNftToDownloadQueue, updatePersistedNft } from '../stores'
import { checkIfNftShouldBeDownloaded } from '../utils/checkIfNftShouldBeDownloaded'

export async function addNftsToDownloadQueue(
    accountIndex: number,
    nfts: Nft[],
    forceDownload: boolean = true
): Promise<void> {
    const nftsToAdd: Nft[] = []
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

async function validateNft(accountIndex: number, nft: Nft): Promise<undefined | Nft> {
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
