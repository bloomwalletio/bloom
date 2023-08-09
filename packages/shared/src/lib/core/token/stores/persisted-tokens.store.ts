import { get } from 'svelte/store'

import { activeProfileId } from '@core/profile/stores/active-profile-id.store'
import { activeProfile } from '@core/profile/stores/active-profile.store'
import { persistent } from '@core/utils/store'

import { NotVerifiedStatus, VerifiedStatus } from '../enums'
import { IPersistedToken, IPersistedTokens } from '../interfaces'

export const persistedTokens = persistent<IPersistedTokens>('persistedTokens', {})

export function getPersistedAsset(tokenId: string): IPersistedToken {
    return get(persistedTokens)?.[get(activeProfile)?.id]?.[tokenId]
}

export function addPersistedAsset(...newPersistedTokens: IPersistedToken[]): void {
    persistedTokens.update((state) => {
        if (!state[get(activeProfile).id]) {
            state[get(activeProfile).id] = {}
        }
        for (const token of newPersistedTokens) {
            state[get(activeProfile).id][token.id] = token
        }
        return state
    })
}

export function clearPersistedAssetForActiveProfile(): void {
    persistedTokens.update((state) => {
        state[get(activeProfile).id] = {}
        return state
    })
}

export function updatePersistedAsset(partialPersistedAsset: Partial<IPersistedToken>): void {
    const asssetId = partialPersistedAsset?.id
    if (asssetId) {
        persistedTokens.update((state) => {
            state[get(activeProfile).id][asssetId] = {
                ...state[get(activeProfile).id][asssetId],
                ...partialPersistedAsset,
            }
            return state
        })
    }
}

export function removePersistedAsset(assetId: string): void {
    const profileId = get(activeProfileId)
    if (!profileId) {
        return
    }
    persistedTokens.update((_persistedAssets) => {
        if (_persistedAssets?.[profileId]?.[assetId]) {
            delete _persistedAssets[profileId][assetId]
        }
        return _persistedAssets
    })
}

export function verifyAsset(assetId: string, status: VerifiedStatus): void {
    updatePersistedAsset({ id: assetId, verification: { verified: true, status } })
}

export function unverifyAsset(assetId: string, status: NotVerifiedStatus): void {
    updatePersistedAsset({ id: assetId, verification: { verified: false, status } })
}

export function hideAsset(assetId: string): void {
    updatePersistedAsset({ id: assetId, hidden: true })
}

export function unhideAsset(assetId: string): void {
    updatePersistedAsset({ id: assetId, hidden: false })
}
