import { Erc721InterfaceId } from '@core/layer-2/enums'
import { Contract } from '@core/layer-2/types'
import { NetworkId } from '@core/network/types'

import { MimeType, NftStandard } from '../enums'
import { DownloadMetadata, IErc721ContractMetadata, IErc721TokenMetadata, IPersistedErc721Nft } from '../interfaces'
import { buildFilePath, composeUrlFromNftUri } from '.'
import { activeProfileId } from '@core/profile/stores'
import { get } from 'svelte/store'

export async function buildPersistedErc721Nft(
    ownerAddress: string,
    networkId: NetworkId,
    tokenId: string,
    contract: Contract,
    contractMetadata: IErc721ContractMetadata
): Promise<IPersistedErc721Nft> {
    const persistedNft: IPersistedErc721Nft = {
        ownerAddress,
        networkId,
        standard: NftStandard.Erc721,
        uri: '',
        contractAddress: contractMetadata.address,
        contractMetadata,
        tokenId,
        downloadMetadata: {},
    }

    const hasTokenMetadata = await contract.methods.supportsInterface(Erc721InterfaceId.Metadata).call()
    if (hasTokenMetadata) {
        try {
            const tokenUri = await contract.methods.tokenURI(tokenId).call()
            const composedTokenUri = composeUrlFromNftUri(tokenUri)
            if (!composedTokenUri) {
                throw new Error('Unable to create composed NFT URI!')
            }

            const response = await fetch(composedTokenUri)
            const metadata = await response.json()

            if (metadata) {
                const erc721Metadata: IErc721TokenMetadata = {
                    type: 'image/png' as MimeType,
                    name: metadata.name,
                    image: metadata.image,
                    description: metadata.description,
                    date: metadata.date,
                    edition: metadata.edition,
                    dna: metadata.dna,
                    attributes: metadata.attributes,
                }
                persistedNft.metadata = erc721Metadata
            }

            persistedNft.composedUrl = composeUrlFromNftUri(metadata.image)

            const downloadMetadata: DownloadMetadata = {
                downloadUrl: persistedNft.composedUrl,
                filePath: buildFilePath(get(activeProfileId), `${contractMetadata.address}:${tokenId}`),
            }

            persistedNft.downloadMetadata = downloadMetadata
        } catch (err) {
            throw new Error(`Unable to get metadata of token ${tokenId} from contract ${contractMetadata.address}`)
        }
    }

    return persistedNft
}
