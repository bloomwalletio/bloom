import { activeProfileNftsPerAccount } from '../stores'
import { Nft } from '../interfaces'

export function setAccountNftsInAllAccountNfts(accountIndex: number, accountNfts: Nft[]): void {
    activeProfileNftsPerAccount.update((state) => {
        state[accountIndex] = accountNfts
        return state
    })
}
