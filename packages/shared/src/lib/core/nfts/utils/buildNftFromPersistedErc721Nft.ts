import { getActiveProfile } from '@core/profile/stores'
import { INft, IPersistedErc721Nft } from '../interfaces'
import { composeUrlFromNftUri, isErc721NftSpendable, MimeType, NftStandard } from '@core/nfts'

export async function buildNftFromPersistedErc721Nft(nft: IPersistedErc721Nft): Promise<INft> {
    const { contractMetadata, networkId, ownerAddress, tokenId, metadata } = nft
    const { address } = contractMetadata

    const id = tokenId ? `${address}:${tokenId}` : address
    const composedUrl = composeUrlFromNftUri(metadata?.image) ?? ''
    const downloadUrl = metadata?.image
    const filePath = `${getActiveProfile().id}/nfts/${id}`
    const downloadMetadata = {
        error: undefined,
        warning: undefined,
        isLoaded: false,
    }
    const isSpendable = await isErc721NftSpendable(nft)

    return {
        id,
        ownerAddress,
        standard: NftStandard.Erc721,
        networkId,
        isSpendable,
        address: contractMetadata.address,
        name: metadata?.name ?? contractMetadata.name,
        description: metadata?.description,
        contractMetadata: nft.contractMetadata,
        ...(metadata && { metadata }),
        type: MimeType.ImagePng,
        ...(tokenId && { tokenId }),
        composedUrl,
        downloadUrl,
        filePath,
        downloadMetadata,
    } as INft
}
