import { allAccountNfts } from '../stores'
import { Nft } from '../interfaces'

export function setAccountNftsInAllAccountNfts(accountIndex: number, accountNfts: Nft[]): void {
    allAccountNfts.update((state) => {
        state[accountIndex] = accountNfts
        return state
    })
}
