import { persistent } from '@core/utils/store'
import { IAssetBalanceChange } from '../types/asset-balance-change.interface'
import { get } from 'svelte/store'
import { activeProfileId } from '@core/profile'
import { NetworkId } from '@core/network'

interface IPersistedBalanceChangesStore {
    [profileId: string]: {
        [accountId: string]: {
            [networkId: NetworkId]: {
                [assetId: string]: IAssetBalanceChange[]
            }
        }
    }
}

export const persistedBalanceChanges = persistent<IPersistedBalanceChangesStore>('balanceChanges', {})

export function getBalanceChanges(
    accountIndex: number,
    networkId: NetworkId
): {
    [assetId: string]: IAssetBalanceChange[]
} {
    return get(persistedBalanceChanges)?.[get(activeProfileId)]?.[accountIndex]?.[networkId]
}

export function addPersistedBalanceChange(
    accountIndex: number,
    networkId: NetworkId,
    assetId: string,
    ...newPersistedAssets: IAssetBalanceChange[]
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
        if (!state[get(activeProfileId)][accountIndex][networkId][assetId]) {
            state[get(activeProfileId)][accountIndex][networkId][assetId] = []
        }

        state[get(activeProfileId)][accountIndex][networkId][assetId].push(...newPersistedAssets)
        return state
    })
}
