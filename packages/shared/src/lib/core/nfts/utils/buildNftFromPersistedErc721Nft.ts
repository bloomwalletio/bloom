import { DEFAULT_NFT_NAME, MimeType } from '@core/nfts'
import { IErc721Nft, IPersistedErc721Nft } from '../interfaces'

export function buildNftFromPersistedErc721Nft(nft: IPersistedErc721Nft, accountAddress: string): IErc721Nft {
    const isSpendable = nft.ownerAddress === accountAddress

    return {
        ...nft,
        isSpendable,
        name: nft.metadata?.name ?? nft.contractMetadata.name ?? DEFAULT_NFT_NAME,
        description: nft.metadata?.description,
        type: MimeType.ImagePng,
        isLoaded: false,
    }
}
