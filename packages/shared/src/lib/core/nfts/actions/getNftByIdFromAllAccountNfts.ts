import { INft } from '../interfaces'
import { getNftsForAccount } from './getNftsForAccount'

export function getNftByIdFromAllAccountNfts(accountIndex: number, nftId: string): INft {
    return getNftsForAccount(accountIndex).find((_nft) => _nft.id === nftId)
}
