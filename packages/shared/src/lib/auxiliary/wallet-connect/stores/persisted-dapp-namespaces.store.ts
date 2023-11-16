import { persistent } from '@core/utils/store'
import { Writable, get } from 'svelte/store'
import { SupportedNamespaces } from '../types'
import { getActiveProfile } from '@core/profile/stores'

interface IPersistedNamespaces {
    [profileId: string]: {
        [dappId: string]: SupportedNamespaces
    }
}

export const persistedDappNamespaces: Writable<IPersistedNamespaces> = persistent('persistedDappNamespaces', {})

export function getPersistedDappNamespacesForDapp(dappId: string): SupportedNamespaces | undefined {
    const profileId = getActiveProfile()?.id
    return get(persistedDappNamespaces)?.[profileId]?.[dappId]
}

export function persistDappNamespacesForDapp(dappId: string, namespaces: SupportedNamespaces): void {
    const profileId = getActiveProfile()?.id

    return persistedDappNamespaces.update((state) => {
        if (!state[profileId]) {
            state[profileId] = {}
        }
        state[profileId][dappId] = namespaces
        return state
    })
}
