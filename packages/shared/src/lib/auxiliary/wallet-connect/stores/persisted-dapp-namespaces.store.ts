import { persistent } from '@core/utils/store'
import { Writable } from 'svelte/store'
import { SupportedNamespaces } from '../types'
import { ProposalTypes } from '@walletconnect/types'

interface IPersistedNamespacesStore {
    [profileId: string]: {
        [dappOriginUrl: string]: {
            supported: SupportedNamespaces
            required: ProposalTypes.RequiredNamespaces
            optional: ProposalTypes.OptionalNamespaces
        }
    }
}
// Keeping this store for for backwards compatibility for 1.0.1
export const persistedDappNamespaces: Writable<IPersistedNamespacesStore> = persistent('persistedDappNamespaces', {})
