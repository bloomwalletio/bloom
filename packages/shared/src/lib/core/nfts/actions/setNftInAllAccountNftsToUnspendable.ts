import { activeProfileNftsPerAccount } from '../stores'
import { isIrc27Nft } from '@core/nfts'

export function setNftInAllAccountNftsToUnspendable(accountIndex: number, ...unspendableNftIds: string[]): void {
    activeProfileNftsPerAccount.update((state) => {
        if (!state[accountIndex]) {
            state[accountIndex] = []
        }
        for (const nftId of unspendableNftIds) {
            const nft = state[accountIndex].find((_nft) => _nft.id === nftId)
            if (nft && isIrc27Nft(nft)) {
                nft.isSpendable = false
                Object.assign(nft, nft)
            }
        }
        return state
    })
}
