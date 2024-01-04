import { allAccountNfts } from '../stores'
import { Nft } from '../interfaces'

export function updateNftInAllAccountNfts(accountIndex: number, nftId: string, partialNft: Partial<Nft>): void {
    allAccountNfts.update((state) => {
        if (!state[accountIndex]) {
            state[accountIndex] = []
        }
        const nft = state[accountIndex].find((_nft) => _nft.id === nftId)
        if (nft) {
            Object.assign(nft, { ...nft, ...partialNft })
        }
        return state
    })
}
