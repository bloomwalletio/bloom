import { get } from 'svelte/store'
import { INft } from '../interfaces'
import { allAccountNfts } from '../stores'

export function getNftByIdFromAllAccountNfts(accountIndex: number, nftId: string): INft {
    return get(allAccountNfts)[accountIndex]?.find((_nft) => _nft.id === nftId)
}
