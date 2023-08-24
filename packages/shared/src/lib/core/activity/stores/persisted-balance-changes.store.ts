import { persistent } from '@core/utils/store'
import { ITokenBalanceChange } from '../types/token-balance-change.interface'
import { get } from 'svelte/store'
import { NetworkId } from '@core/network'
import { activeProfileId } from '@core/profile/stores'

type IPersistedBalanceChangesStore = {
    [profileId: string]: {
        [accountId: string]: {
            [networkId in NetworkId]?: {
                [tokenId: string]: ITokenBalanceChange[]
            }
        }
    }
}

export const persistedBalanceChanges = persistent<IPersistedBalanceChangesStore>('balanceChanges', {})

export function getBalanceChanges(
    accountIndex: number,
    networkId: NetworkId
): { [tokenId: string]: ITokenBalanceChange[] } {
    return get(persistedBalanceChanges)?.[get(activeProfileId)]?.[accountIndex]?.[networkId] ?? {}
}

export function addPersistedBalanceChange(
    accountIndex: number,
    networkId: NetworkId,
    tokenId: string,
    ...newPersistedAssets: ITokenBalanceChange[]
): void {
    persistedBalanceChanges.update((state) => {
        let profileBalanceChanges = state[get(activeProfileId)]

        if (!profileBalanceChanges) {
            profileBalanceChanges = {}
        }

        let accountBalanceChanges = profileBalanceChanges[accountIndex]
        if (!accountBalanceChanges) {
            accountBalanceChanges = {}
        }

        let networkBalanceChanges = accountBalanceChanges[networkId]
        if (!networkBalanceChanges) {
            networkBalanceChanges = {
                [tokenId]: newPersistedAssets,
            }
        } else {
            if (networkBalanceChanges[tokenId]) {
                networkBalanceChanges[tokenId].push(...newPersistedAssets)
            } else {
                networkBalanceChanges[tokenId] = newPersistedAssets
            }
        }

        accountBalanceChanges[networkId] = networkBalanceChanges
        profileBalanceChanges[accountIndex] = accountBalanceChanges
        state[get(activeProfileId)] = profileBalanceChanges
        return state
    })
}
