import { getActiveProfileId } from '@core/profile/stores/active-profile-id.store'
import { persistent } from '@core/utils/store'
import { get } from 'svelte/store'
import { NotVerifiedStatus, VerifiedStatus } from '../enums'
import { IPersistedToken, IPersistedTokens, IToken } from '../interfaces'
import { NetworkId } from '@core/network/types'

export const persistedTokens = persistent<IPersistedTokens>('persistedTokens', {})

export function getPersistedToken(networkId: NetworkId, tokenId: string): IPersistedToken {
    const profileId = getActiveProfileId()
    return get(persistedTokens)?.[profileId]?.[networkId]?.[tokenId]
}

export function addPersistedToken(networkId: NetworkId, ...newPersistedTokens: IPersistedToken[]): void {
    const profileId = getActiveProfileId()
    persistedTokens.update((state) => {
        if (!state[profileId]) {
            state[profileId] = {}
        }
        if (!state[profileId][networkId]) {
            state[profileId][networkId] = {}
        }
        for (const token of newPersistedTokens) {
            state[profileId][networkId][token.id] = token
        }
        return state
    })
}

export function clearPersistedTokensForActiveProfile(): void {
    const profileId = getActiveProfileId()
    persistedTokens.update((state) => {
        state[profileId] = {}
        return state
    })
}

export function updatePersistedToken(networkId: NetworkId, partialPersistedToken: Partial<IPersistedToken>): void {
    const profileId = getActiveProfileId()
    const tokenId = partialPersistedToken?.id
    persistedTokens.update((state) => {
        if (!tokenId || state[profileId]?.[networkId]?.[tokenId] === undefined) {
            return state
        }
        state[profileId][networkId][tokenId] = {
            ...state[profileId][tokenId],
            ...partialPersistedToken,
        }
        return state
    })
}

export function removePersistedTokensForProfile(profileId: string): void {
    persistedTokens.update((state) => {
        delete state[profileId]
        return state
    })
}

export function verifyToken(token: IToken, status: VerifiedStatus): void {
    updatePersistedToken(token.networkId, { id: token.id, verification: { verified: true, status } })
}

export function unverifyToken(token: IToken, status: NotVerifiedStatus): void {
    updatePersistedToken(token.networkId, { id: token.id, verification: { verified: false, status } })
}

export function hideToken(token: IToken): void {
    updatePersistedToken(token.networkId, { id: token.id, hidden: true })
}

export function unhideToken(token: IToken): void {
    updatePersistedToken(token.networkId, { id: token.id, hidden: false })
}
