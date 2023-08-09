import { persistent } from '@core/utils/store'
import { ITokenBalanceChange } from '../types/token-balance-change.interface'
import { get } from 'svelte/store'
import { activeProfileId } from '@core/profile'

interface IPersistedBalanceChangesStore {
    [profileId: string]: {
        [accountId: string]: {
            [chainId: string | number]: {
                [tokenId: string]: ITokenBalanceChange[]
            }
        }
    }
}

export const persistedBalanceChanges = persistent<IPersistedBalanceChangesStore>('balanceChanges', {})

export function getBalanceChanges(
    accountIndex: number,
    chainId: string | number
): {
    [tokenId: string]: ITokenBalanceChange[]
} {
    return get(persistedBalanceChanges)?.[get(activeProfileId)]?.[accountIndex]?.[chainId]
}

export function addPersistedBalanceChange(
    accountIndex: number,
    chainId: string | number,
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
        if (!state[get(activeProfileId)][accountIndex][chainId]) {
            state[get(activeProfileId)][accountIndex][chainId] = {}
        }
        if (!state[get(activeProfileId)][accountIndex][chainId][tokenId]) {
            state[get(activeProfileId)][accountIndex][chainId][tokenId] = []
        }

        state[get(activeProfileId)][accountIndex][chainId][tokenId].push(...newPersistedAssets)
        return state
    })
}
