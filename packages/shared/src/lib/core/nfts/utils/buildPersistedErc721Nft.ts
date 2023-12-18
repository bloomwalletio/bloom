import { Erc721InterfaceId } from '@core/layer-2/enums'
import { Contract } from '@core/layer-2/types'
import { NetworkId } from '@core/network/types'

import { MimeType, NftStandard } from '../enums'
import { IErc721ContractMetadata, IErc721TokenMetadata, IPersistedErc721Nft } from '../interfaces'
import { composeUrlFromNftUri } from '.'

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
        contractMetadata,
        tokenId,
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
            const metadata = (await response.json()) as IErc721TokenMetadata
            if (metadata) {
                persistedNft.metadata = { ...metadata, type: 'image/png' as MimeType }
                persistedNft.downloadUrl = composeUrlFromNftUri(metadata.image)
            }
        } catch (err) {
            throw new Error(`Unable to get metadata of token ${tokenId} from contract ${contractMetadata.address}`)
        }
    }

    return persistedNft
}
