import { getActiveProfile } from '@core/profile/stores'
import { Nft } from '../interfaces'
import { NftStandard } from '../enums'

export function buildFilePath(nft: Nft): string {
    const profileId = getActiveProfile()?.id

    if (nft.standard === NftStandard.Erc721) {
        return `${profileId}/nfts/${nft.contractMetadata.address}:${nft.tokenId}`
    } else {
        return `${profileId}/nfts/${nft.id}`
    }
}
