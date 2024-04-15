import { get } from 'svelte/store'
import { Nft } from '../interfaces'
import { nftFilter, nftSearchTerm } from '../stores'
import { INftFilter } from '../interfaces/nft-filter.interface'

export function isVisibleNft(nft: Nft): boolean {
    const filter = get(nftFilter)
    const searchTerm = get(nftSearchTerm)

    if (!isVisibleWithNetworkFilter(nft, filter)) {
        return false
    }
    if (!isVisibleWithSearchTerm(nft, searchTerm)) {
        return false
    }

    return true
}

function isVisibleWithNetworkFilter(nft: Nft, filter: INftFilter): boolean {
    if (filter.network.active && filter.network.selected && nft.networkId !== filter.network.selected) {
        return false
    }
    return true
}

function isVisibleWithSearchTerm(nft: Nft, searchTerm: string): boolean {
    if (searchTerm) {
        return nft.name.toLowerCase().includes(searchTerm.toLowerCase())
    }
    return true
}
