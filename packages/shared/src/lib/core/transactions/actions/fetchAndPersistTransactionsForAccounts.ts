import { IBlockscoutTransaction } from '@auxiliary/blockscout/interfaces'
import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
import {
    addBlockscoutTokenTransferToPersistedTransactions,
    addBlockscoutTransactionToPersistedTransactions,
    getPersistedTransactionsForChain,
    isBlockscoutTokenTransferPersisted,
    isBlockscoutTransactionPersisted,
} from '../stores'
import { BlockscoutApi } from '@auxiliary/blockscout/api'
import { EvmNetworkId, IEvmNetwork, getEvmNetworks } from '@core/network'
import { BlockscoutTokenTransfer } from '@auxiliary/blockscout/types'
import { generateEvmActivityFromPersistedTransaction } from '@core/activity/utils'
import { EvmActivity, addAccountActivities, allAccountActivities } from '@core/activity'
import { get } from 'svelte/store'

export async function fetchAndPersistTransactionsForAccounts(
    profileId: string,
    accounts: IAccountState[]
): Promise<void> {
    const networks = getEvmNetworks()
    for (const network of networks) {
        if (!network.explorerUrl) {
            continue
        }

        const networkId = network.id
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

            const activities = await generateActivityForMissingTransactions(profileId, account, network)
            addAccountActivities(account.index, activities)
        }
    }
}

async function generateActivityForMissingTransactions(
    profileId: string,
    account: IAccountState,
    chain: IEvmNetwork
): Promise<EvmActivity[]> {
    const activities: EvmActivity[] = []
    const persistedTransactions = getPersistedTransactionsForChain(profileId, account.index, chain)
    const accountActivities = new Set(
        get(allAccountActivities)[account.index]?.map((activity) => activity.transactionId) ?? []
    )

    const persistedTransactionsWithoutActivity = persistedTransactions.filter((persistedTransaction) => {
        const transactionHash =
            persistedTransaction.tokenTransfer?.tx_hash ??
            persistedTransaction.blockscout?.hash ??
            persistedTransaction.local?.transactionHash
        return transactionHash && !accountActivities.has(transactionHash)
    })

    for (const persistedTransaction of persistedTransactionsWithoutActivity) {
        try {
            const activity = await generateEvmActivityFromPersistedTransaction(persistedTransaction, chain, account)
            if (activity) {
                activities.push(activity)
            }
        } catch (error) {
            console.error(error)
        }
    }
    return activities
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
