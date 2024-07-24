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

        await fetchAndPersistTransactionsForNetwork(network, profileId, accounts)
    }
}

export async function fetchAndPersistTransactionsForNetwork(
    network: IEvmNetwork,
    profileId: string,
    accounts: IAccountState[]
): Promise<void> {
    for (const account of accounts) {
        try {
            const blockscoutTransactions = await fetchBlockscoutTransactionsForAccount(profileId, account, network)
            blockscoutTransactions &&
                addBlockscoutTransactionToPersistedTransactions(
                    profileId,
                    account.index,
                    network.id,
                    blockscoutTransactions
                )

            const blockscoutTokenTransfers = await fetchBlockscoutTokenTransfersForAccount(profileId, account, network)
            blockscoutTokenTransfers &&
                addBlockscoutTokenTransferToPersistedTransactions(
                    profileId,
                    account.index,
                    network.id,
                    blockscoutTokenTransfers
                )
        } catch (err) {
            console.error(err)
        }

        const activities = await generateActivityForMissingTransactions(profileId, account, network)
        addAccountActivities(account.index, activities)
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
    network: IEvmNetwork
): Promise<IBlockscoutTransaction[] | undefined> {
    const address = getAddressFromAccountForNetwork(account, network.id)
    if (!address) {
        return undefined
    }
    const blockscoutApi = new BlockscoutApi(network.explorerUrl ?? '')
    const transactions = await blockscoutApi.getTransactionsForAddress(address, (items: IBlockscoutTransaction[]) =>
        getTransactionsExitFunction(items, profileId, account.index, network.id)
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
    network: IEvmNetwork
): Promise<BlockscoutTokenTransfer[] | undefined> {
    const address = getAddressFromAccountForNetwork(account, network.id)
    if (!address) {
        return undefined
    }
    const blockscoutApi = new BlockscoutApi(network.explorerUrl ?? '')
    const tokenTransfers = await blockscoutApi.getTokenTransfersForAddress(
        address,
        undefined,
        (items: BlockscoutTokenTransfer[]) => getTokenTransferExitFunction(items, profileId, account.index, network.id)
    )
    return tokenTransfers
}
