import { DEFAULT_NFT_NAME, MimeType, isErc721NftSpendable } from '@core/nfts'
import { IErc721Nft, IPersistedErc721Nft } from '../interfaces'

export async function buildNftFromPersistedErc721Nft(nft: IPersistedErc721Nft): Promise<IErc721Nft> {
    const id = nft.tokenId ? `${nft.contractMetadata.address}:${nft.tokenId}` : nft.contractMetadata.address
    const isSpendable = await isErc721NftSpendable(nft)

    return {
        ...nft,
        id,
        isSpendable,
        name: nft.metadata?.name ?? nft.contractMetadata.name ?? DEFAULT_NFT_NAME,
        description: nft.metadata?.description,
        type: MimeType.ImagePng,
        isLoaded: false,
    }
}
