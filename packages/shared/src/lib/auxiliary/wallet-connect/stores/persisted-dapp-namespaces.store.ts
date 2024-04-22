import { persistent } from '@core/utils/store'
import { Writable } from 'svelte/store'
import { IPersistedNamespaces } from '../interface'

interface IPersistedNamespacesStore {
    [profileId: string]: {
        [dappOriginUrl: string]: IPersistedNamespaces
    }
}

export const persistedDappNamespaces: Writable<IPersistedNamespacesStore> = persistent('persistedDappNamespaces', {})
