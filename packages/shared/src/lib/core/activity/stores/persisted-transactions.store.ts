import { activeProfileId } from '@core/profile/stores'
import { persistent } from '@core/utils/store'
import { get } from 'svelte/store'
import { PersistedEvmTransaction } from '../types'
import { NetworkId } from '@core/network/types'

interface IPersistedEvmTransactions {
    [profileId: string]: {
        [accountId: string]: {
            [networkId: NetworkId]: PersistedEvmTransaction[]
        }
    }
}

export const persistedEvmTransactions = persistent<IPersistedEvmTransactions>('evmTransactions', {})

export function getPersistedEvmTransactions(accountIndex: number, networkId: NetworkId): PersistedEvmTransaction[] {
    return get(persistedEvmTransactions)?.[get(activeProfileId)]?.[accountIndex]?.[networkId]
}

export function addPersistedTransaction(
    accountIndex: number,
    networkId: NetworkId,
    ...newTransactions: PersistedEvmTransaction[]
): void {
    persistedEvmTransactions.update((state) => {
        if (!state[get(activeProfileId)]) {
            state[get(activeProfileId)] = {}
        }
        if (!state[get(activeProfileId)][accountIndex]) {
            state[get(activeProfileId)][accountIndex] = {}
        }
        if (!state[get(activeProfileId)][accountIndex][networkId]) {
            state[get(activeProfileId)][accountIndex][networkId] = []
        }

        state[get(activeProfileId)][accountIndex][networkId].push(...newTransactions)
        return state
    })
}
