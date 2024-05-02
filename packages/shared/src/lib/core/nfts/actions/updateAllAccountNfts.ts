import { activeProfileNftsPerAccount } from '../stores'
import { Nft } from '../interfaces'

export function updateAllAccountNftsForAccount(accountIndex: number, ...newNfts: Nft[]): void {
    activeProfileNftsPerAccount.update((state) => {
        if (!state[accountIndex]) {
            state[accountIndex] = []
        }
        for (const newNft of newNfts) {
            const nft = state[accountIndex].find((_nft) => _nft.id === newNft.id)
            if (nft) {
                Object.assign(nft, newNft)
            } else {
                state[accountIndex].push(newNft)
            }
        }
        return state
    })
}
