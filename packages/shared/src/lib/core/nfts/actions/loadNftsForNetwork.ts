import { addOrUpdateNftsForAccount, getNftsForAccount } from '../stores'
import { IEvmNetwork } from '@core/network'
import { IAccountState } from '@core/account'

export async function loadNftsForNetwork(account: IAccountState, network: IEvmNetwork): Promise<void> {
    const accountNfts = getNftsForAccount(account.index)
    const nfts = await network.getNftsForAccount(account)

    for (const nft of nfts) {
        const alreadyAdded = accountNfts.some((_nft) => _nft.id === nft.id)
        if (!alreadyAdded) {
            accountNfts.push(nft)
        }
    }
    addOrUpdateNftsForAccount(account.index, accountNfts)
}
