import { get } from 'svelte/store'
import { Nft } from '../interfaces'
import { allAccountNfts } from '../stores'

export function getNftByIdFromAllAccountNfts(accountIndex: number, nftId: string): Nft {
    return get(allAccountNfts)[accountIndex]?.find((_nft) => _nft.id === nftId)
}
