import { Erc721InterfaceId } from '@core/layer-2/enums'
import { Contract } from '@core/layer-2/types'
import { NftStandard } from '../enums'
import {
    IErc721ContractMetadata,
    IErc721TokenMetadata,
    IErc721TokenMetadataAttribute,
    IPersistedErc721Nft,
} from '../interfaces'
import { composeUrlFromNftUri } from '../utils'

export async function getPersistedErc721NftFromContract(
    tokenId: string,
    contract: Contract,
    contractMetadata: IErc721ContractMetadata
): Promise<IPersistedErc721Nft> {
    const persistedNft: IPersistedErc721Nft = {
        standard: NftStandard.Erc721,
        contractMetadata,
        tokenId,
    }

    const hasTokenMetadata = await contract.methods.supportsInterface(Erc721InterfaceId.Metadata).call()
    if (hasTokenMetadata) {
        try {
            const tokenUri = await contract.methods.tokenURI(tokenId).call()
            const composedTokenUri = composeUrlFromNftUri(tokenUri)
            persistedNft.tokenUri = composedTokenUri

            const response = await fetch(composedTokenUri)
            const metadata = (await response.json()) as IErc721TokenMetadata
            if (metadata) {
                const attributes: IErc721TokenMetadataAttribute[] = metadata.attributes?.map((attribute) => ({
                    traitType: attribute['trait_type'],
                    value: attribute.value,
                }))
                persistedNft.tokenMetadata = {
                    ...metadata,
                    image: composeUrlFromNftUri(metadata.image) ?? metadata.image,
                    attributes,
                }
            }
        } catch (err) {
            throw new Error(`Unable to get metadata of token ${tokenId} from contract ${contractMetadata.address}`)
        }
    }

    return persistedNft
}