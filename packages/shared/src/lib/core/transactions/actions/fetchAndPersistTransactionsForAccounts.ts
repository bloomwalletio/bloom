import { IBlockscoutTransaction } from '@auxiliary/blockscout/interfaces'
import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
import { addBlockscoutTransactionToPersistedTransactions } from '../stores'
import { BlockscoutApi } from '@auxiliary/blockscout/api'
import { EvmNetworkId, getNetwork } from '@core/network'

export async function fetchAndPersistTransactionsForAccounts(
    profileId: string,
    accounts: IAccountState[]
): Promise<void> {
    const chains = getNetwork()?.getChains() ?? []
    for (const chain of chains) {
        const networkId = chain.getConfiguration().id as EvmNetworkId
        for (const account of accounts) {
            try {
                const blockscoutTransactions = await fetchBlockscoutTransactionsForAccount(account, networkId)
                blockscoutTransactions &&
                    addBlockscoutTransactionToPersistedTransactions(
                        profileId,
                        account.index,
                        networkId,
                        blockscoutTransactions
                    )
            } catch (err) {
                console.error(err)
            }
        }
    }
}

async function fetchBlockscoutTransactionsForAccount(
    account: IAccountState,
    networkId: EvmNetworkId
): Promise<IBlockscoutTransaction[] | undefined> {
    const address = getAddressFromAccountForNetwork(account, networkId)
    if (!address) {
        return undefined
    }
    const blockscoutApi = new BlockscoutApi(networkId)
    const transactions = await blockscoutApi.getTransactionsForAddress(address)
    return transactions
}
