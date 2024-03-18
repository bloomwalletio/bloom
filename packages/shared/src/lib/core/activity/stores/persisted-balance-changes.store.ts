import { persistent } from '@core/utils/store'
import { ITokenBalanceChange } from '../types/token-balance-change.interface'
import { INftBalanceChange } from '../types/nft-balance-change.interface'
import { get } from 'svelte/store'
import { NetworkId } from '@core/network'
import { getActiveProfileId } from '@core/profile/stores'

type IPersistedBalanceChangesStore = {
    [profileId: string]: {
        [accountId: string]: {
            [networkId in NetworkId]?: {
                nfts: {
                    [nftId: string]: INftBalanceChange[]
                }
                tokens: {
                    [tokenId: string]: ITokenBalanceChange[]
                }
            }
        }
    }
}

export const persistedBalanceChanges = persistent<IPersistedBalanceChangesStore>('balanceChanges', {})

export function getBalanceChanges(
    accountIndex: number,
    networkId: NetworkId
): {
    nfts: {
        [nftId: string]: INftBalanceChange[]
    }
    tokens: {
        [tokenId: string]: ITokenBalanceChange[]
    }
} {
    return get(persistedBalanceChanges)?.[getActiveProfileId()]?.[accountIndex]?.[networkId] ?? { nfts: {}, tokens: {} }
}

export function addPersistedTokenBalanceChange(
    accountIndex: number,
    networkId: NetworkId,
    tokenId: string,
    ...newPersistedTokenBalanceChanges: ITokenBalanceChange[]
): void {
    persistedBalanceChanges.update((state) => {
        const profileId = getActiveProfileId()
        let profileBalanceChanges = state[profileId]

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
                tokens: {
                    [tokenId]: newPersistedTokenBalanceChanges,
                },
                nfts: {},
            }
        } else {
            if (networkBalanceChanges.tokens[tokenId]) {
                networkBalanceChanges.tokens[tokenId].push(...newPersistedTokenBalanceChanges)
            } else {
                networkBalanceChanges.tokens[tokenId] = newPersistedTokenBalanceChanges
            }
        }

        accountBalanceChanges[networkId] = networkBalanceChanges
        profileBalanceChanges[accountIndex] = accountBalanceChanges
        state[profileId] = profileBalanceChanges
        return state
    })
}

export function addPersistedNftBalanceChange(
    accountIndex: number,
    networkId: NetworkId,
    nftId: string,
    ...newPersistedNftBalanceChanges: INftBalanceChange[]
): void {
    persistedBalanceChanges.update((state) => {
        const profileId = getActiveProfileId()
        let profileBalanceChanges = state[profileId]

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
                nfts: {
                    [nftId]: newPersistedNftBalanceChanges,
                },
                tokens: {},
            }
        } else {
            if (networkBalanceChanges.nfts[nftId]) {
                networkBalanceChanges.nfts[nftId].push(...newPersistedNftBalanceChanges)
            } else {
                networkBalanceChanges.nfts[nftId] = newPersistedNftBalanceChanges
            }
        }

        accountBalanceChanges[networkId] = networkBalanceChanges
        profileBalanceChanges[accountIndex] = accountBalanceChanges
        state[profileId] = profileBalanceChanges
        return state
    })
}

export function removePersistedBalanceChangesForProfile(profileId: string): void {
    persistedBalanceChanges.update((state) => {
        delete state[profileId]
        return state
    })
}
