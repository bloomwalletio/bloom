import { persistent } from '@core/utils/store'
import { Writable, get } from 'svelte/store'
import { SupportedNamespaces } from '../types'
import { getActiveProfile } from '@core/profile/stores'

interface IPersistedNamespaces {
    [profileId: string]: {
        [dappOrigin: string]: SupportedNamespaces
    }
}

export const persistedDappNamespaces: Writable<IPersistedNamespaces> = persistent('persistedDappNamespaces', {})

export function getPersistedDappNamespacesForDapp(dappOrigin: string): SupportedNamespaces | undefined {
    const profileId = getActiveProfile()?.id

    return get(persistedDappNamespaces)?.[profileId]?.[dappOrigin]
}
