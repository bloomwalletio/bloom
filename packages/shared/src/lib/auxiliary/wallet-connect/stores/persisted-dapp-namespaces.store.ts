import { persistent } from '@core/utils/store'
import { Writable, get } from 'svelte/store'
import { SupportedNamespaces } from '../types'
import { getActiveProfile } from '@core/profile/stores'
import { ProposalTypes } from '@walletconnect/types'
import { IPersistedNamespaces } from '../interface'

interface IPersistedNamespacesStore {
    [profileId: string]: {
        [dappOriginUrl: string]: IPersistedNamespaces
    }
}

export const persistedDappNamespaces: Writable<IPersistedNamespacesStore> = persistent('persistedDappNamespaces', {})

export function getPersistedDappNamespacesForDapp(dappOriginUrl: string): IPersistedNamespaces | undefined {
    const profileId = getActiveProfile()?.id
    return get(persistedDappNamespaces)?.[profileId]?.[dappOriginUrl]
}

export function persistDappNamespacesForDapp(
    dappOriginUrl: string,
    supported: SupportedNamespaces,
    required: ProposalTypes.RequiredNamespaces,
    optional: ProposalTypes.OptionalNamespaces
): void {
    const profileId = getActiveProfile()?.id

    return persistedDappNamespaces.update((state) => {
        if (!state[profileId]) {
            state[profileId] = {}
        }
        state[profileId][dappOriginUrl] = { supported, required, optional }

        return state
    })
}

export function updateSupportedDappNamespacesForDapp(dappOriginUrl: string, supported: SupportedNamespaces): void {
    const profileId = getActiveProfile()?.id

    return persistedDappNamespaces.update((state) => {
        const persistedNamespaces = state?.[profileId]?.[dappOriginUrl]

        if (!persistedNamespaces) {
            return state
        }

        state[profileId][dappOriginUrl] = {
            ...persistedNamespaces,
            supported: { ...persistedNamespaces.supported, ...supported },
        }
        return state
    })
}

export function removeDappNamespacesForDapp(dappOriginUrl: string): void {
    const profileId = getActiveProfile()?.id

    return persistedDappNamespaces.update((state) => {
        if (!state[profileId]) {
            return state
        }
        delete state[profileId][dappOriginUrl]
        return state
    })
}
