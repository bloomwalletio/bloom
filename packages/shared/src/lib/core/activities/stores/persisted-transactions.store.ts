import { persistent } from '@core/utils/store'
import { get } from 'svelte/store'
import { activeProfileId } from '@core/profile'
import { TransactionReceipt } from 'web3-core'

interface IPersistedEvmTransactions {
    [profileId: string]: {
        [accountId: string]: {
            [chainId: string | number]: TransactionReceipt[]
        }
    }
}

export const persistedEvmTransactions = persistent<IPersistedEvmTransactions>('evmTransactions', {})

export function getBalanceChanges(accountIndex: number, chainId: string | number): TransactionReceipt[] {
    return get(persistedEvmTransactions)?.[get(activeProfileId)]?.[accountIndex]?.[chainId]
}

export function addPersistedTransaction(
    accountIndex: number,
    chainId: string | number,
    ...newTransactions: TransactionReceipt[]
): void {
    persistedEvmTransactions.update((state) => {
        if (!state[get(activeProfileId)]) {
            state[get(activeProfileId)] = {}
        }
        if (!state[get(activeProfileId)][accountIndex]) {
            state[get(activeProfileId)][accountIndex] = {}
        }
        if (!state[get(activeProfileId)][accountIndex][chainId]) {
            state[get(activeProfileId)][accountIndex][chainId] = []
        }

        state[get(activeProfileId)][accountIndex][chainId].push(...newTransactions)
        return state
    })
}
