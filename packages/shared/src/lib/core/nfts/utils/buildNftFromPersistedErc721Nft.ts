import { getActiveProfile } from '@core/profile/stores'
import { INft, IPersistedErc721Nft } from '../interfaces'
import { composeUrlFromNftUri, MimeType, NftStandard } from '@core/nfts'

export function buildNftFromPersistedErc721Nft(nft: IPersistedErc721Nft): INft {
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

    return {
        id,
        ownerAddress,
        standard: NftStandard.Erc721,
        networkId,
        address: contractMetadata.address,
        name: tokenMetadata?.name ?? contractMetadata.name,
        description: tokenMetadata?.description,
        metadata: {
            contract: nft.contractMetadata,
            ...(tokenMetadata && { token: tokenMetadata }),
            type: MimeType.ImagePng,
        },
        ...(tokenId && { tokenId }),
        composedUrl,
        downloadUrl,
        filePath,
        downloadMetadata,
    } as INft
}
