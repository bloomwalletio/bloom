import { updateNftInAllAccountNfts } from '.'
import { INft } from '../interfaces'
import { addNftToDownloadQueue, updatePersistedNft } from '../stores'
import { checkIfNftShouldBeDownloaded } from '../utils/checkIfNftShouldBeDownloaded'

export function addNftsToDownloadQueue(accountIndex: number, nfts: INft[], forceDownload: boolean = true): void {
    for (const nft of nfts) {
        const shouldNotDownloadNft = nft.isLoaded || !!nft.downloadMetadata?.error || !!nft.downloadMetadata?.warning
        if (shouldNotDownloadNft && !forceDownload) {
            continue
        } else {
            void validateNftThenAddToQueue(accountIndex, nft)
        }
    }
}

async function validateNftThenAddToQueue(accountIndex: number, nft: INft): Promise<void> {
    try {
        const { shouldDownload, downloadMetadata, isLoaded } = await checkIfNftShouldBeDownloaded(nft)
        updatePersistedNft(nft.id, { downloadMetadata })
        updateNftInAllAccountNfts(accountIndex, nft.id, { downloadMetadata, isLoaded })

        if (shouldDownload) {
            addNftToDownloadQueue({ nft, accountIndex })
        }
    } catch (error) {
        console.error(error)
    }
}
