import { get } from 'svelte/store'
import { NftStandard } from '../enums'
import { activeProfileNftsPerAccount } from '../stores'

export function isNftOwnedByAnyAccount(nftId: string): boolean {
    for (const accountNfts of Object.values(get(activeProfileNftsPerAccount))) {
        const nft = accountNfts.find((nft) => nft.id === nftId)
        switch (nft?.standard) {
            case NftStandard.Erc721:
            case NftStandard.Irc27:
                return nft.isSpendable
            default:
                break
        }
    }
    return false
}
