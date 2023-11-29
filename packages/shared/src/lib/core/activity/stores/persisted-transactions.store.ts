import { activeProfileId } from '@core/profile/stores'
import { persistent } from '@core/utils/store'
import { get } from 'svelte/store'
import { PersistedEvmTransaction } from '../types'
import { NetworkId } from '@core/network/types'
import { IChain } from '@core/network/interfaces'

type PersistedEvmTransactions = {
    [profileId: string]: {
        [accountId: string]: {
            [networkId in NetworkId]?: PersistedEvmTransaction[]
        }
    }
}

export const persistedEvmTransactions = persistent<PersistedEvmTransactions>('evmTransactions', {})

export function getPersistedEvmTransactions(accountIndex: number, chain: IChain): PersistedEvmTransaction[] {
    const networkId = chain.getConfiguration().id
    return get(persistedEvmTransactions)?.[get(activeProfileId)]?.[accountIndex]?.[networkId] ?? []
}

export function addPersistedTransaction(
    accountIndex: number,
    chain: IChain,
    ...newTransactions: PersistedEvmTransaction[]
): void {
    const networkId = chain.getConfiguration().id
    const profileId = get(activeProfileId)
    persistedEvmTransactions.update((state) => {
        if (!state[profileId]) {
            state[profileId] = {}
        }
        if (!state[profileId][accountIndex]) {
            state[profileId][accountIndex] = {
                [networkId]: [],
            }
        }
        if (!state[profileId][accountIndex][networkId]) {
            state[profileId][accountIndex][networkId] = []
        }

        state[get(activeProfileId)][accountIndex][networkId]?.push(...newTransactions)
        return state
    })
}

export function removePersistedEvmTransactionsForProfile(profileId: string): void {
    persistedEvmTransactions.update((state) => {
        delete state[profileId]
        return state
    })
}
