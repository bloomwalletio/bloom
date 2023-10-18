import { allAccountNfts } from '../stores'

export function setNftInAllAccountNftsToUnspendable(accountIndex: number, ...unspendableNftIds: string[]): void {
    allAccountNfts.update((state) => {
        if (!state[accountIndex]) {
            state[accountIndex] = []
        }
        for (const nftId of unspendableNftIds) {
            const nft = state[accountIndex].find((_nft) => _nft.id === nftId)
            if (nft) {
                nft.isSpendable = false
                Object.assign(nft, nft)
            }
        }
        return state
    })
}
