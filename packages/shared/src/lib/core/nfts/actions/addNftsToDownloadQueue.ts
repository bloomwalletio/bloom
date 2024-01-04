import { updateNftInAllAccountNfts } from '.'
import { Nft } from '../interfaces'
import { addNftToDownloadQueue } from '../stores'
import { checkIfNftShouldBeDownloaded } from '../utils/checkIfNftShouldBeDownloaded'

export function addNftsToDownloadQueue(accountIndex: number, nfts: Nft[], forceDownload: boolean = true): void {
    for (const nft of nfts) {
        const shouldNotDownloadNft =
            nft?.downloadMetadata?.isLoaded || !!nft?.downloadMetadata?.error || !!nft?.downloadMetadata?.warning
        if (shouldNotDownloadNft && !forceDownload) {
            continue
        } else {
            void validateNftThenAddToQueue(accountIndex, nft)
        }
    }
}

async function validateNftThenAddToQueue(accountIndex: number, nft: Nft): Promise<void> {
    try {
        console.log('nft pre add:', nft)
        const { shouldDownload, downloadMetadata } = await checkIfNftShouldBeDownloaded(nft)
        nft.downloadMetadata = downloadMetadata
        updateNftInAllAccountNfts(accountIndex, nft.id, { downloadMetadata })

        if (shouldDownload) {
            addNftToDownloadQueue({ nft, accountIndex })
        }
    } catch (error) {
        console.error(error)
    }
}
