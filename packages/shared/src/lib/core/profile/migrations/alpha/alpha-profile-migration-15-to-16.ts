import { DappVerification } from '@auxiliary/wallet-connect/enums'
import { persistDapp, persistedDappNamespaces } from '@auxiliary/wallet-connect/stores'
import { IPersistedProfile } from '@core/profile/interfaces'
import { persistedTokens } from '@core/token/stores'
import { get } from 'svelte/store'

export function alphaProfileMigration15To16(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    const namespaces = get(persistedDappNamespaces)[profile.id] ?? {}
    for (const dappUrl of Object.keys(namespaces)) {
        persistDapp(dappUrl, DappVerification.Unknown, namespaces[dappUrl])
    }

    persistedDappNamespaces.update((state) => {
        delete state[profile.id]
        return state
    })

    persistedTokens.update((state) => {
        delete state[profile.id]
        return state
    })
    return Promise.resolve()
}
