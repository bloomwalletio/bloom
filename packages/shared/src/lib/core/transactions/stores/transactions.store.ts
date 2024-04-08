import { IBlockscoutTransaction } from '@auxiliary/blockscout/interfaces'
import { EvmNetworkId } from '@core/network'
import { IChain } from '@core/network/interfaces'
import { persistent } from '@core/utils/store'
import { get } from 'svelte/store'
import { LocalEvmTransaction, PersistedTransaction } from '../types/'
import { BlockscoutTokenTransfer } from '@auxiliary/blockscout/types'

type PersistedTransactions = {
    [profileId: string]: {
        [accountId: string]: {
            [networkId in EvmNetworkId]?: {
                [transactionHash: string]: PersistedTransaction
            }
        }
    }
}

export const persistedTransactions = persistent<PersistedTransactions>('transactions', {})

export function getPersistedTransactionsForChain(
    profileId: string,
    accountIndex: number,
    chain: IChain
): PersistedTransaction[] {
    const networkId = chain.id as EvmNetworkId
    return Object.values(get(persistedTransactions)?.[profileId]?.[accountIndex]?.[networkId] ?? {}) ?? []
}

export function addLocalTransactionToPersistedTransaction(
    profileId: string,
    accountIndex: number,
    networkId: EvmNetworkId,
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

export function addBlockscoutTransactionToPersistedTransactions(
    profileId: string,
    accountIndex: number,
    networkId: EvmNetworkId,
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

export function addBlockscoutTokenTransferToPersistedTransactions(
    profileId: string,
    accountIndex: number,
    networkId: EvmNetworkId,
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
    networkId: EvmNetworkId,
    transactionHash: string
): boolean {
    return !!get(persistedTransactions)?.[profileId]?.[accountIndex]?.[networkId]?.[transactionHash]?.blockscout
}

export function isBlockscoutTokenTransferPersisted(
    profileId: string,
    accountIndex: number,
    networkId: EvmNetworkId,
    transactionHash: string
): boolean {
    return !!get(persistedTransactions)?.[profileId]?.[accountIndex]?.[networkId]?.[transactionHash]?.tokenTransfer
}
