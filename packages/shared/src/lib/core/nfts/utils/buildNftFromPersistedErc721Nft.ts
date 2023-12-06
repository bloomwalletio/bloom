import { INft, IPersistedErc721Nft, NftDownloadMetadata } from '../interfaces'
import { composeUrlFromNftUri, NftStandard } from '@core/nfts'

export function buildNftFromPersistedErc721Nft(nft: IPersistedErc721Nft): INft {
    const { contractMetadata, networkId, ownerAddress, tokenId, tokenMetadata } = nft
    const { address } = contractMetadata

    const id = tokenId ? `${address}:${tokenId}` : address
    const composedUrl = composeUrlFromNftUri(tokenMetadata?.image) ?? ''
    const downloadUrl = tokenMetadata?.image
    const filePath = 'TODO'
    const downloadMetadata = {} as NftDownloadMetadata

    return {
        id,
        ownerAddress,
        standard: NftStandard.Erc721,
        networkId,
        address: contractMetadata.address,
        name: tokenMetadata?.name ?? contractMetadata.name,
        metadata: {
            contract: nft.contractMetadata,
            ...(tokenMetadata && { token: tokenMetadata }),
        },
        ...(tokenId && { tokenId }),
        composedUrl,
        downloadUrl,
        filePath,
        downloadMetadata,
    } as INft
}
