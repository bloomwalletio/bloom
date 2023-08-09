import { get } from 'svelte/store'

import { activeProfileId } from '@core/profile/stores/active-profile-id.store'
import { activeProfile } from '@core/profile/stores/active-profile.store'
import { persistent } from '@core/utils/store'

import { NotVerifiedStatus, VerifiedStatus } from '../enums'
import { IPersistedToken, IPersistedTokens } from '../interfaces'

export const persistedTokens = persistent<IPersistedTokens>('persistedTokens', {})

export function getPersistedToken(tokenId: string): IPersistedToken {
    return get(persistedTokens)?.[get(activeProfile)?.id]?.[tokenId]
}

export function addPersistedToken(...newPersistedTokens: IPersistedToken[]): void {
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

export function clearPersistedTokensForActiveProfile(): void {
    persistedTokens.update((state) => {
        state[get(activeProfile).id] = {}
        return state
    })
}

export function updatePersistedToken(partialPersistedAsset: Partial<IPersistedToken>): void {
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

export function removePersistedToken(assetId: string): void {
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

export function verifyToken(assetId: string, status: VerifiedStatus): void {
    updatePersistedToken({ id: assetId, verification: { verified: true, status } })
}

export function unverifyToken(assetId: string, status: NotVerifiedStatus): void {
    updatePersistedToken({ id: assetId, verification: { verified: false, status } })
}

export function hideToken(assetId: string): void {
    updatePersistedToken({ id: assetId, hidden: true })
}

export function unhideToken(assetId: string): void {
    updatePersistedToken({ id: assetId, hidden: false })
}
