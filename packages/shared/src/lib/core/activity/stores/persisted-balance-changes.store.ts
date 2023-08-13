import { persistent } from '@core/utils/store'
import { ITokenBalanceChange } from '../types/token-balance-change.interface'
import { get } from 'svelte/store'
import { NetworkId } from '@core/network'
import { activeProfileId } from '@core/profile/stores'

interface IPersistedBalanceChangesStore {
    [profileId: string]: {
        [accountId: string]: {
            [networkId: NetworkId]: {
                [tokenId: string]: ITokenBalanceChange[]
            }
        }
    }
}

export const persistedBalanceChanges = persistent<IPersistedBalanceChangesStore>('balanceChanges', {})

export function getBalanceChanges(
    accountIndex: number,
    networkId: NetworkId
): {
    [tokenId: string]: ITokenBalanceChange[]
} {
    return get(persistedBalanceChanges)?.[get(activeProfileId)]?.[accountIndex]?.[networkId]
}

export function addPersistedBalanceChange(
    accountIndex: number,
    networkId: NetworkId,
    tokenId: string,
    ...newPersistedAssets: ITokenBalanceChange[]
): void {
    persistedBalanceChanges.update((state) => {
        if (!state[get(activeProfileId)]) {
            state[get(activeProfileId)] = {}
        }
        if (!state[get(activeProfileId)][accountIndex]) {
            state[get(activeProfileId)][accountIndex] = {}
        }
        if (!state[get(activeProfileId)][accountIndex][networkId]) {
            state[get(activeProfileId)][accountIndex][networkId] = {}
        }
        if (!state[get(activeProfileId)][accountIndex][networkId][tokenId]) {
            state[get(activeProfileId)][accountIndex][networkId][tokenId] = []
        }

        state[get(activeProfileId)][accountIndex][networkId][tokenId].push(...newPersistedAssets)
        return state
    })
}
