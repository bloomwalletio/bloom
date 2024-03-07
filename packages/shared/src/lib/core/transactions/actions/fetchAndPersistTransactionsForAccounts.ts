import { IBlockscoutTransaction } from '@auxiliary/blockscout/interfaces'
import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
import {
    addBlockscoutTokenTransferToPersistedTransactions,
    addBlockscoutTransactionToPersistedTransactions,
    isBlockscoutTokenTransferPersisted,
    isBlockscoutTransactionPersisted,
} from '../stores'
import { BlockscoutApi } from '@auxiliary/blockscout/api'
import { EvmNetworkId, getNetwork } from '@core/network'
import { BlockscoutTokenTransfer } from '@auxiliary/blockscout/types'

export async function fetchAndPersistTransactionsForAccounts(
    profileId: string,
    accounts: IAccountState[]
): Promise<void> {
    const chains = getNetwork()?.getChains() ?? []
    for (const chain of chains) {
        const networkId = chain.getConfiguration().id as EvmNetworkId
        for (const account of accounts) {
            try {
                const blockscoutTransactions = await fetchBlockscoutTransactionsForAccount(
                    profileId,
                    account,
                    networkId
                )
                blockscoutTransactions &&
                    addBlockscoutTransactionToPersistedTransactions(
                        profileId,
                        account.index,
                        networkId,
                        blockscoutTransactions
                    )

                const blockscoutTokenTransfers = await fetchBlockscoutTokenTransfersForAccount(
                    profileId,
                    account,
                    networkId
                )
                blockscoutTokenTransfers &&
                    addBlockscoutTokenTransferToPersistedTransactions(
                        profileId,
                        account.index,
                        networkId,
                        blockscoutTokenTransfers
                    )
            } catch (err) {
                console.error(err)
            }
        }
    }
}

function getTransactionsExitFunction(
    items: IBlockscoutTransaction[],
    profileId: string,
    accountIndex: number,
    networkId: EvmNetworkId
): boolean {
    const lastItem = items[items.length - 1]
    return lastItem ? isBlockscoutTransactionPersisted(profileId, accountIndex, networkId, lastItem.hash) : false
}

async function fetchBlockscoutTransactionsForAccount(
    profileId: string,
    account: IAccountState,
    networkId: EvmNetworkId
): Promise<IBlockscoutTransaction[] | undefined> {
    const address = getAddressFromAccountForNetwork(account, networkId)
    if (!address) {
        return undefined
    }
    const blockscoutApi = new BlockscoutApi(networkId)
    const transactions = await blockscoutApi.getTransactionsForAddress(address, (items: IBlockscoutTransaction[]) =>
        getTransactionsExitFunction(items, profileId, account.index, networkId)
    )
    return transactions
}

function getTokenTransferExitFunction(
    items: BlockscoutTokenTransfer[],
    profileId: string,
    accountIndex: number,
    networkId: EvmNetworkId
): boolean {
    const lastItem = items[items.length - 1]
    return lastItem ? isBlockscoutTokenTransferPersisted(profileId, accountIndex, networkId, lastItem.tx_hash) : false
}

async function fetchBlockscoutTokenTransfersForAccount(
    profileId: string,
    account: IAccountState,
    networkId: EvmNetworkId
): Promise<BlockscoutTokenTransfer[] | undefined> {
    const address = getAddressFromAccountForNetwork(account, networkId)
    if (!address) {
        return undefined
    }
    const blockscoutApi = new BlockscoutApi(networkId)
    const tokenTransfers = await blockscoutApi.getTokenTransfersForAddress(
        address,
        undefined,
        (items: BlockscoutTokenTransfer[]) => getTokenTransferExitFunction(items, profileId, account.index, networkId)
    )
    return tokenTransfers
}
