import { NftStandard } from '../enums'
import { Nft } from '../interfaces'

export function getCollectionIdFromNft(nft: Nft): string | undefined {
    if (nft.standard === NftStandard.Irc27) {
        return nft.issuer?.aliasId ?? nft.issuer?.nftId
    } else if (nft.standard === NftStandard.Erc721) {
        return nft.contractMetadata.address
    }
}
