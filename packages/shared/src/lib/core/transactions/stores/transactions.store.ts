import { IBlockscoutTransaction } from '@auxiliary/blockscout/interfaces'
import { PersistedEvmTransaction } from '@core/activity'
import { EvmNetworkId } from '@core/network'
import { IChain } from '@core/network/interfaces'
import { activeProfileId } from '@core/profile/stores'
import { persistent } from '@core/utils/store'
import { get } from 'svelte/store'

export type PersistedTransaction =
    | {
          blockscout: IBlockscoutTransaction
          local: PersistedEvmTransaction
      }
    | {
          blockscout?: IBlockscoutTransaction
          local: PersistedEvmTransaction
      }
    | {
          blockscout: IBlockscoutTransaction
          local?: PersistedEvmTransaction
      }

type PersistedTransactions = {
    [profileId: string]: {
        [accountId: string]: {
            [networkId in EvmNetworkId]?: {
                [transactionHash: string]: PersistedTransaction
            }
        }
    }
}

export const persistedTransactions = persistent<PersistedTransactions>('', {})

export function getPersistedTransactionsForChain(
    profileId: string,
    accountIndex: number,
    chain: IChain
): PersistedTransaction[] {
    const networkId = chain.getConfiguration().id as EvmNetworkId
    return Object.values(get(persistedTransactions)?.[profileId]?.[accountIndex]?.[networkId] ?? {}) ?? []
}

export function addLocalTransactionToPersistedTransaction(
    profileId: string,
    accountIndex: number,
    networkId: EvmNetworkId,
    newTransactions: PersistedEvmTransaction[]
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

        const _transactions = state[get(activeProfileId)][accountIndex][networkId] ?? {}
        for (const transaction of newTransactions) {
            const existingTransaction = _transactions?.[transaction.transactionHash.toLowerCase()]
            const updatedTransaction: PersistedTransaction = {
                ...existingTransaction,
                local: transaction,
            }
            _transactions[transaction.transactionHash.toLowerCase()] = updatedTransaction
        }
        state[get(activeProfileId)][accountIndex][networkId] = _transactions

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

        const _transactions = state[get(activeProfileId)][accountIndex][networkId] ?? {}
        for (const transaction of newTransactions) {
            const existingTransaction = _transactions?.[transaction.hash.toLowerCase()]
            const updatedTransaction: PersistedTransaction = {
                ...existingTransaction,
                blockscout: transaction,
            }
            _transactions[transaction.hash.toLowerCase()] = updatedTransaction
        }
        state[get(activeProfileId)][accountIndex][networkId] = _transactions

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
