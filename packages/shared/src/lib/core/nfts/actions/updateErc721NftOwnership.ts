import { IAccountState } from '@core/account'
import { updateAllAccountNftsForAccount } from './updateAllAccountNfts'
import { NftStandard } from '../enums'
import { IErc721Nft } from '../interfaces'
import { getAllAccountNfts } from '../stores'
import { isErc721NftSpendable } from '../utils'

export async function updateErc721NftsOwnership(account: IAccountState): Promise<void> {
    const trackedErc721Nfts = getAllAccountNfts()[account.index].filter((nft) => {
        return nft.standard === NftStandard.Erc721
    })

    const promises = []
    async function check(nft: IErc721Nft): Promise<void> {
        const isSpendable = await isErc721NftSpendable(nft)
        if (nft.isSpendable !== isSpendable) {
            updateAllAccountNftsForAccount(account.index, { ...nft, isSpendable })
        }
    }

    for (const nft of trackedErc721Nfts) {
        promises.push(check(nft as IErc721Nft))
    }
    await Promise.all(promises)
}
