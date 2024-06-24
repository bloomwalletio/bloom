import { DappVerification } from '@auxiliary/wallet-connect/enums'
import { persistDapp, persistedDappNamespaces } from '@auxiliary/wallet-connect/stores'
import { IPersistedProfile } from '@core/profile/interfaces'
import { get } from 'svelte/store'

export function alphaProfileMigration15To16(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    const namespaces = get(persistedDappNamespaces)[profile.id] ?? {}
    for (const dappUrl of Object.keys(namespaces)) {
        const { required, optional, supported } = namespaces[dappUrl]
        persistDapp(dappUrl, DappVerification.Unknown, required, optional, supported)
    }

    persistedDappNamespaces.update((state) => {
        delete state[profile.id]
        return state
    })
    return Promise.resolve()
}
