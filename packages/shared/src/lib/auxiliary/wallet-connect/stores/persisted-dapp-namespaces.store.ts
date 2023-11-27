import { persistent } from '@core/utils/store'
import { Writable, get } from 'svelte/store'
import { SupportedNamespaces } from '../types'
import { getActiveProfile } from '@core/profile/stores'

interface IPersistedNamespaces {
    [profileId: string]: {
        [dappOriginUrl: string]: SupportedNamespaces
    }
}

export const persistedDappNamespaces: Writable<IPersistedNamespaces> = persistent('persistedDappNamespaces', {})

export function getPersistedDappNamespacesForDapp(dappOriginUrl: string): SupportedNamespaces | undefined {
    const profileId = getActiveProfile()?.id
    return get(persistedDappNamespaces)?.[profileId]?.[dappOriginUrl]
}

export function persistDappNamespacesForDapp(dappOriginUrl: string, namespaces: SupportedNamespaces): void {
    const profileId = getActiveProfile()?.id

    return persistedDappNamespaces.update((state) => {
        if (!state[profileId]) {
            state[profileId] = {}
        }
        state[profileId][dappOriginUrl] = namespaces
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
