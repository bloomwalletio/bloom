import { DappVerification } from '@auxiliary/wallet-connect/enums'
import { persistedDappNamespaces, persistedDapps } from '@auxiliary/wallet-connect/stores'
import { IPersistedProfile } from '@core/profile/interfaces'
import { get } from 'svelte/store'

export function alphaProfileMigration15To16(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    const namespaces = get(persistedDappNamespaces)[profile.id] ?? {}

    persistedDapps.update((state) => {
        if (!state[profile.id]) {
            state[profile.id] = {}
        }
        for (const dappUrl of Object.keys(namespaces)) {
            state[profile.id][dappUrl] = {
                verificationState: DappVerification.Unknown,
                namespaces: namespaces[dappUrl],
            }
        }
        return state
    })

    persistedDappNamespaces.update((state) => {
        delete state[profile.id]
        return state
    })
    return Promise.resolve()
}
