import { activeAccounts } from '@core/profile/stores'
import { addOrUpdateNftsForAccount, getNftsForAccount } from '../stores'
import { IEvmNetwork } from '@core/network'
import { get } from 'svelte/store'

export async function loadNftsForNetwork(network: IEvmNetwork): Promise<void> {
    for (const account of get(activeAccounts)) {
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
}
