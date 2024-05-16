import { Erc721InterfaceId } from '@core/layer-2/enums'
import { EvmNetworkId } from '@core/network/types'

import { MimeType, NftStandard } from '../enums'
import { IErc721ContractMetadata, IErc721TokenMetadata, IPersistedErc721Nft } from '../interfaces'
import { getPrimaryNftUrl } from './getPrimaryNftUrl'
import { Contract, ContractAbi } from 'web3'

export async function buildPersistedErc721Nft(
    nftId: string,
    ownerAddress: string,
    networkId: EvmNetworkId,
    tokenId: string,
    contract: Contract<ContractAbi>,
    contractMetadata: IErc721ContractMetadata
): Promise<IPersistedErc721Nft> {
    const persistedNft: IPersistedErc721Nft = {
        id: nftId,
        ownerAddress,
        networkId,
        standard: NftStandard.Erc721,
        hidden: false,
        uri: '',
        contractMetadata,
        tokenId,
        downloadMetadata: undefined,
    }

    const hasTokenMetadata = await contract.methods.supportsInterface(Erc721InterfaceId.Metadata).call<boolean>()
    if (hasTokenMetadata) {
        try {
            const tokenUri = await contract.methods.tokenURI(tokenId).call<string>()
            const composedTokenUri = getPrimaryNftUrl(tokenUri)
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

            persistedNft.mediaUrl = metadata.image
        } catch (err) {
            throw new Error(`Unable to get metadata of token ${tokenId} from contract ${contractMetadata.address}`)
        }
    }

    return persistedNft
}
