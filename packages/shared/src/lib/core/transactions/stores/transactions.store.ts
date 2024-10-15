import { IBlockscoutTransaction } from '@auxiliary/blockscout/interfaces'
import { NetworkId } from '@core/network'
import { IEvmNetwork } from '@core/network/interfaces'
import { persistent } from '@core/utils/store'
import { get } from 'svelte/store'
import { LocalEvmTransaction, PersistedTransaction } from '../types/'
import { BlockscoutTokenTransfer } from '@auxiliary/blockscout/types'
import { NovesTxResponse } from '@auxiliary/noves'

type PersistedTransactions = {
    [profileId: string]: {
        [accountId: string]: {
            [networkId in NetworkId]?: {
                [transactionHash: string]: PersistedTransaction
            }
        }
    }
}

export const persistedTransactions = persistent<PersistedTransactions>('transactions', {})

export function getPersistedTransactionsForChain(
    profileId: string,
    accountIndex: number,
    evmNetwork: IEvmNetwork
): PersistedTransaction[] {
    const networkId = evmNetwork.id
    return Object.values(get(persistedTransactions)?.[profileId]?.[accountIndex]?.[networkId] ?? {}) ?? []
}

export function getPersistedTransaction(transactionId: string | undefined): PersistedTransaction | undefined {
    if (!transactionId) {
        return undefined
    }
    const allTransactions = Object.values(get(persistedTransactions)).flatMap((profile) =>
        Object.values(profile).flatMap((account) =>
            Object.values(account).flatMap((network) => Object.values(network ?? {}))
        )
    )
    return allTransactions.find((transaction) => transaction.local?.transactionHash === transactionId)
}

export function addLocalTransactionToPersistedTransaction(
    profileId: string,
    accountIndex: number,
    networkId: NetworkId,
    newTransactions: LocalEvmTransaction[]
): void {
    persistedTransactions.update((state) => {
        if (!state[profileId]) {
            state[profileId] = {}
        }
        if (!state[profileId][accountIndex]) {
            state[profileId][accountIndex] = {
                [networkId]: {},
            }
        }
        if (!state[profileId][accountIndex][networkId]) {
            state[profileId][accountIndex][networkId] = {}
        }

        const _transactions = state[profileId][accountIndex][networkId] ?? {}
        for (const transaction of newTransactions) {
            const existingTransaction = _transactions?.[transaction.transactionHash.toLowerCase()]
            const updatedTransaction: PersistedTransaction = {
                ...existingTransaction,
                local: transaction,
            }
            _transactions[transaction.transactionHash.toLowerCase()] = updatedTransaction
        }
        state[profileId][accountIndex][networkId] = _transactions

        return state
    })
}

export function updatePersistedTransactionWithPartialLocalTransaction(
    profileId: string,
    accountIndex: number,
    networkId: NetworkId,
    partialLocalEvmTransaction: Partial<LocalEvmTransaction> & { transactionHash: string }
): PersistedTransaction | undefined {
    let updatedTransaction: PersistedTransaction | undefined

    persistedTransactions.update((state) => {
        if (!state[profileId]) {
            state[profileId] = {}
        }
        if (!state[profileId][accountIndex]) {
            state[profileId][accountIndex] = {
                [networkId]: {},
            }
        }
        if (!state[profileId][accountIndex][networkId]) {
            state[profileId][accountIndex][networkId] = {}
        }

        const _transactions = state[profileId][accountIndex][networkId] ?? {}
        const existingTransaction = _transactions[partialLocalEvmTransaction.transactionHash.toLowerCase()]
        if (existingTransaction.local) {
            updatedTransaction = {
                ...existingTransaction,
                local: {
                    ...existingTransaction.local,
                    ...partialLocalEvmTransaction,
                } as LocalEvmTransaction,
            }
            existingTransaction.local = updatedTransaction.local
        }

        return state
    })

    return updatedTransaction
}

export function addBlockscoutTransactionToPersistedTransactions(
    profileId: string,
    accountIndex: number,
    networkId: NetworkId,
    newTransactions: IBlockscoutTransaction[]
): void {
    persistedTransactions.update((state) => {
        if (!state[profileId]) {
            state[profileId] = {}
        }
        if (!state[profileId][accountIndex]) {
            state[profileId][accountIndex] = {
                [networkId]: {},
            }
        }
        if (!state[profileId][accountIndex][networkId]) {
            state[profileId][accountIndex][networkId] = {}
        }

        const _transactions = state[profileId][accountIndex][networkId] ?? {}
        for (const transaction of newTransactions) {
            const existingTransaction = _transactions?.[transaction.hash.toLowerCase()]
            const updatedTransaction: PersistedTransaction = {
                ...existingTransaction,
                blockscout: transaction,
            }
            _transactions[transaction.hash.toLowerCase()] = updatedTransaction
        }
        state[profileId][accountIndex][networkId] = _transactions

        return state
    })
}

export function addNovesTransactionToPersistedTransactions(
    profileId: string,
    accountIndex: number,
    networkId: NetworkId,
    newTransactions: NovesTxResponse[]
): void {
    persistedTransactions.update((state) => {
        if (!state[profileId]) {
            state[profileId] = {}
        }
        if (!state[profileId][accountIndex]) {
            state[profileId][accountIndex] = {
                [networkId]: {},
            }
        }
        if (!state[profileId][accountIndex][networkId]) {
            state[profileId][accountIndex][networkId] = {}
        }

        const _transactions = state[profileId][accountIndex][networkId] ?? {}
        for (const transaction of newTransactions) {
            const existingTransaction = _transactions?.[transaction.rawTransactionData.transactionHash.toLowerCase()]
            const updatedTransaction: PersistedTransaction = {
                ...existingTransaction,
                noves: transaction,
            }
            _transactions[transaction.rawTransactionData.transactionHash.toLowerCase()] = updatedTransaction
        }
        state[profileId][accountIndex][networkId] = _transactions

        return state
    })
}

export function addBlockscoutTokenTransferToPersistedTransactions(
    profileId: string,
    accountIndex: number,
    networkId: NetworkId,
    newTokenTransfers: BlockscoutTokenTransfer[]
): void {
    persistedTransactions.update((state) => {
        if (!state[profileId]) {
            state[profileId] = {}
        }
        if (!state[profileId][accountIndex]) {
            state[profileId][accountIndex] = {
                [networkId]: {},
            }
        }
        if (!state[profileId][accountIndex][networkId]) {
            state[profileId][accountIndex][networkId] = {}
        }

        const _transactions = state[profileId][accountIndex][networkId] ?? {}
        for (const tokenTransfer of newTokenTransfers) {
            const existingTransaction = _transactions?.[tokenTransfer.tx_hash.toLowerCase()]
            const updatedTransaction: PersistedTransaction = {
                ...existingTransaction,
                tokenTransfer,
            }
            _transactions[tokenTransfer.tx_hash.toLowerCase()] = updatedTransaction
        }
        state[profileId][accountIndex][networkId] = _transactions

        return state
    })
}

export function removePersistedTransactionsForProfile(profileId: string): void {
    persistedTransactions.update((state) => {
        delete state[profileId]
        return state
    })
}

export function isBlockscoutTransactionPersisted(
    profileId: string,
    accountIndex: number,
    networkId: NetworkId,
    transactionHash: string
): boolean {
    return !!get(persistedTransactions)?.[profileId]?.[accountIndex]?.[networkId]?.[transactionHash]?.blockscout
}

export function isBlockscoutTokenTransferPersisted(
    profileId: string,
    accountIndex: number,
    networkId: NetworkId,
    transactionHash: string
): boolean {
    return !!get(persistedTransactions)?.[profileId]?.[accountIndex]?.[networkId]?.[transactionHash]?.tokenTransfer
}
