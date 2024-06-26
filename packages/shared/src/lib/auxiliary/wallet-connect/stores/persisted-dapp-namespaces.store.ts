import { persistent } from '@core/utils/store'
import { Writable } from 'svelte/store'
import { IPersistedNamespaces } from '../interface'

interface IPersistedNamespacesStore {
    [profileId: string]: {
        [dappOriginUrl: string]: IPersistedNamespaces
    }
}
// Keeping this store for for backwards compatibility for 1.0.1
export const persistedDappNamespaces: Writable<IPersistedNamespacesStore> = persistent('persistedDappNamespaces', {})
