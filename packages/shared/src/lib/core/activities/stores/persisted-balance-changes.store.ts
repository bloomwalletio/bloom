import { persistent } from '@core/utils/store'
import { IAssetBalanceChange } from '../types/asset-balance-change.interface'
import { get } from 'svelte/store'
import { activeProfileId } from '@core/profile'

interface IPersistedBalanceChangesStore {
    [profileId: string]: {
        [accountId: string]: {
            [chainId: string | number]: {
                [assetId: string]: IAssetBalanceChange[]
            }
        }
    }
}

export const persistedBalanceChanges = persistent<IPersistedBalanceChangesStore>('balanceChanges', {})

export function getBalanceChanges(
    accountIndex: number,
    chainId: string | number
): {
    [assetId: string]: IAssetBalanceChange[]
} {
    return get(persistedBalanceChanges)?.[get(activeProfileId)]?.[accountIndex]?.[chainId]
}

export function addPersistedBalanceChange(
    accountIndex: number,
    chainId: string | number,
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
        if (!state[get(activeProfileId)][accountIndex][chainId]) {
            state[get(activeProfileId)][accountIndex][chainId] = {}
        }
        if (!state[get(activeProfileId)][accountIndex][chainId][assetId]) {
            state[get(activeProfileId)][accountIndex][chainId][assetId] = []
        }

        state[get(activeProfileId)][accountIndex][chainId][assetId].push(...newPersistedAssets)
        return state
    })
}

export function calculateAndAddPersistedBalanceChange(
    accountIndex: number,
    chainId: string | number,
    assetId: string,
    newBalance: number
): void {
    const balanceChangesForAsset = getBalanceChanges(accountIndex, chainId)?.[assetId]

    const lastBalanceChange = balanceChangesForAsset?.at(-1)

    if (!lastBalanceChange || lastBalanceChange.newBalance !== newBalance) {
        const newBalanceChange: IAssetBalanceChange = {
            changedAt: new Date(),
            oldBalance: lastBalanceChange?.newBalance,
            newBalance,
        }

        addPersistedBalanceChange(accountIndex, chainId, assetId, newBalanceChange)
    }
}
