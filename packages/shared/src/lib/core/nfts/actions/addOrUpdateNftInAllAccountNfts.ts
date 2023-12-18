import { allAccountNfts } from '../stores'
import { INft } from '../interfaces'

export function addOrUpdateNftInAllAccountNfts(accountIndex: number, ...newNfts: INft[]): void {
    allAccountNfts.update((state) => {
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

export function addOrUpdateNftInAllAccountNftsForAllAccounts(...newNfts: INft[]): void {
    allAccountNfts.update((state) => {
        for (const accountNfts of Object.values(state)) {
            for (const newNft of newNfts) {
                const nft = accountNfts.find((_nft) => _nft.id === newNft.id)
                if (nft) {
                    Object.assign(nft, newNft)
                } else {
                    accountNfts.push(newNft)
                }
            }
        }
        return state
    })
}
