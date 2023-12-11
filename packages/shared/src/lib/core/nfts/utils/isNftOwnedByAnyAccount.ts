import { get } from 'svelte/store'
import { NftStandard } from '../enums'
import { allAccountNfts } from '../stores'

export function isNftOwnedByAnyAccount(nftId: string): boolean {
    for (const accountNfts of get(allAccountNfts) ?? []) {
        const nft = accountNfts.find((nft) => nft.id === nftId)
        switch (nft?.standard) {
            case NftStandard.Irc27:
                return nft.isSpendable
            case NftStandard.Erc721:
                return true
            default:
                break
        }
    }
    return false
}
