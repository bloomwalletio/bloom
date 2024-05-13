import { DEFAULT_NFT_NAME, MimeType } from '@core/nfts'
import { IErc721Nft, IPersistedErc721Nft } from '../interfaces'
import { isScamErc721Nft } from './isScamErc721Nft'

export function buildNftFromPersistedErc721Nft(nft: IPersistedErc721Nft, accountAddress: string): IErc721Nft {
    const isSpendable = nft.ownerAddress === accountAddress
    const isScam = nft?.isScam ?? (nft.metadata ? isScamErc721Nft(nft.metadata) : false)
    const collectionId = nft.contractMetadata.address

    return {
        ...nft,
        collectionId,
        isSpendable,
        isScam,
        name: nft.metadata?.name ?? nft.contractMetadata.name ?? DEFAULT_NFT_NAME,
        description: nft.metadata?.description,
        type: MimeType.ImagePng,
        isLoaded: false,
    }
}
