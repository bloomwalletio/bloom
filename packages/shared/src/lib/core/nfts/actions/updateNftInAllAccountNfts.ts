import { activeProfileNftsPerAccount } from '../stores'
import { Nft } from '../interfaces'

export function updateNftInAllAccountNftsForAccount(
    accountIndex: number,
    nftId: string,
    partialNft: Partial<Nft>
): void {
    activeProfileNftsPerAccount.update((state) => {
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

export function updateNftInAllAccountNfts(nftId: string, partialNft: Partial<Nft>): void {
    activeProfileNftsPerAccount.update((state) => {
        for (const accountNfts of Object.values(state)) {
            const nft = accountNfts.find((_nft) => _nft.id === nftId)
            if (nft) {
                Object.assign(nft, { ...nft, ...partialNft })
            }
        }
        return state
    })
}
