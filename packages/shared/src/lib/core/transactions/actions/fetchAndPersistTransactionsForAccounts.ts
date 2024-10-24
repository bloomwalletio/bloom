import { IBlockscoutTransaction } from '@auxiliary/blockscout/interfaces'
import { IAccountState, getAddressFromAccountForNetwork } from '@core/account'
import {
    addBlockscoutTokenTransferToPersistedTransactions,
    addBlockscoutTransactionToPersistedTransactions,
    addNovesTransactionToPersistedTransactions,
    getLatestBlockForPersistedNovesTransactionsForAccountNetwork,
    getPersistedTransactionsForChain,
    isBlockscoutTokenTransferPersisted,
    isBlockscoutTransactionPersisted,
    updateLatestBlockForPersistedNovesTransactionsForAccountNetwork,
} from '../stores'
import { BlockscoutApi } from '@auxiliary/blockscout/api'
import { EvmNetworkId, IEvmNetwork, getEvmNetworks } from '@core/network'
import { BlockscoutTokenTransfer } from '@auxiliary/blockscout/types'
import { generateEvmActivityFromPersistedTransaction } from '@core/activity/utils'
import { EvmActivity, addAccountActivities, allAccountActivities } from '@core/activity'
import { get } from 'svelte/store'
import { SUPPORTED_NETWORK_ID_TO_NOVES_CHAIN, NovesApi, NovesTxResponse } from '@auxiliary/noves'

export async function fetchAndPersistTransactionsForAccounts(
    profileId: string,
    accounts: IAccountState[]
): Promise<void> {
    const networks = getEvmNetworks()
    for (const network of networks) {
        if (!network.blockscoutIndexerUrl) {
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
            const [blockscoutTransactionsPromise, novesTransactionsPromise] = await Promise.allSettled([
                fetchBlockscoutTransactionsForAccount(profileId, account, network),
                fetchNovesTransactionsForAccount(profileId, account, network),
            ])

            const blockscoutTransactions =
                blockscoutTransactionsPromise.status === 'fulfilled' && blockscoutTransactionsPromise.value
            const novesTransactions = novesTransactionsPromise.status === 'fulfilled' && novesTransactionsPromise.value

            blockscoutTransactions &&
                addBlockscoutTransactionToPersistedTransactions(
                    profileId,
                    account.index,
                    network.id,
                    blockscoutTransactions
                )

            if (novesTransactions && novesTransactions.length > 0) {
                addNovesTransactionToPersistedTransactions(profileId, account.index, network.id, novesTransactions)

                // Transactions are in reverse-chronological order
                // So first transaction will be the latest one
                const latestBlock = novesTransactions[0].rawTransactionData.blockNumber
                updateLatestBlockForPersistedNovesTransactionsForAccountNetwork(
                    profileId,
                    account.index,
                    network.id,
                    latestBlock
                )
            }

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
    const blockscoutApi = new BlockscoutApi(network.blockscoutIndexerUrl ?? '')
    const transactions = await blockscoutApi.getTransactionsForAddress(address, (items: IBlockscoutTransaction[]) =>
        getTransactionsExitFunction(items, profileId, account.index, network.id)
    )
    return transactions
}

async function fetchNovesTransactionsForAccount(
    profileId: string,
    account: IAccountState,
    network: IEvmNetwork
): Promise<NovesTxResponse[]> {
    const address = getAddressFromAccountForNetwork(account, network.id)
    const novesChain = SUPPORTED_NETWORK_ID_TO_NOVES_CHAIN[network.id]
    if (!address || !novesChain) {
        return []
    }

    const latestBlock = getLatestBlockForPersistedNovesTransactionsForAccountNetwork(
        profileId,
        account.index,
        network.id
    )

    const novesApi = new NovesApi()
    const transactions = await novesApi.translate.getTransactionsFromAddress(address, novesChain, {
        startBlock: latestBlock,
    })
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
    const blockscoutApi = new BlockscoutApi(network.blockscoutIndexerUrl ?? '')
    const tokenTransfers = await blockscoutApi.getTokenTransfersForAddress(
        address,
        undefined,
        (items: BlockscoutTokenTransfer[]) => getTokenTransferExitFunction(items, profileId, account.index, network.id)
    )
    return tokenTransfers
}
