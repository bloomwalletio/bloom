import { getActiveProfile } from '@core/profile/stores'
import { INft, IPersistedErc721Nft } from '../interfaces'
import { composeUrlFromNftUri, isErc721NftSpendable, MimeType, NftStandard } from '@core/nfts'

export async function buildNftFromPersistedErc721Nft(nft: IPersistedErc721Nft): Promise<INft> {
    const { contractMetadata, networkId, ownerAddress, tokenId, tokenMetadata } = nft
    const { address } = contractMetadata

    const id = tokenId ? `${address}:${tokenId}` : address
    const composedUrl = composeUrlFromNftUri(tokenMetadata?.image) ?? ''
    const downloadUrl = tokenMetadata?.image
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
        name: tokenMetadata?.name ?? contractMetadata.name,
        description: tokenMetadata?.description,
        contractMetadata: nft.contractMetadata,
        ...(tokenMetadata && { tokenMetadata }),
        type: MimeType.ImagePng,
        ...(tokenId && { tokenId }),
        composedUrl,
        downloadUrl,
        filePath,
        downloadMetadata,
    } as INft
}
