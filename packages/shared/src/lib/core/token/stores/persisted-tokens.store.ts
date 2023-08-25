import { activeProfileId } from '@core/profile/stores/active-profile-id.store'
import { activeProfile } from '@core/profile/stores/active-profile.store'
import { persistent } from '@core/utils/store'
import { get } from 'svelte/store'
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

export function updatePersistedToken(partialPersistedToken: Partial<IPersistedToken>): void {
    const tokenId = partialPersistedToken?.id
    if (tokenId) {
        persistedTokens.update((state) => {
            state[get(activeProfile).id][tokenId] = {
                ...state[get(activeProfile).id][tokenId],
                ...partialPersistedToken,
            }
            return state
        })
    }
}

export function removePersistedToken(tokenId: string): void {
    const profileId = get(activeProfileId)
    if (!profileId) {
        return
    }
    persistedTokens.update((_persistedTokens) => {
        if (_persistedTokens?.[profileId]?.[tokenId]) {
            delete _persistedTokens[profileId][tokenId]
        }
        return _persistedTokens
    })
}

export function removePersistedTokensForProfile(profileId: string): void {
    persistedTokens.update((state) => {
        delete state[profileId]
        return state
    })
}

export function verifyToken(tokenId: string, status: VerifiedStatus): void {
    updatePersistedToken({ id: tokenId, verification: { verified: true, status } })
}

export function unverifyToken(tokenId: string, status: NotVerifiedStatus): void {
    updatePersistedToken({ id: tokenId, verification: { verified: false, status } })
}

export function hideToken(tokenId: string): void {
    updatePersistedToken({ id: tokenId, hidden: true })
}

export function unhideToken(tokenId: string): void {
    updatePersistedToken({ id: tokenId, hidden: false })
}
