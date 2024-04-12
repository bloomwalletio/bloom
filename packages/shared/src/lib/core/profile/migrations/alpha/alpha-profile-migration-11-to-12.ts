import { persistedDappNamespaces } from '@auxiliary/wallet-connect/stores'
import { SupportedNamespaces } from '@auxiliary/wallet-connect/types'
import { IPersistedProfile } from '@core/profile/interfaces'
import { ProposalTypes } from '@walletconnect/types'

type OldPersistedNamespaces = {
    [dappOriginUrl: string]: SupportedNamespaces
}

type NewPersistedNamespaces = {
    [dappOriginUrl: string]: {
        supported: SupportedNamespaces
        required: ProposalTypes.RequiredNamespaces
        optional: ProposalTypes.OptionalNamespaces
    }
}

export function alphaProfileMigration11To12(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    persistedDappNamespaces.update((state) => {
        const profileId = profile.id
        if (!state[profileId]) {
            state[profileId] = {}
            return state
        }
        const persistedNamespaces = state[profileId] as unknown as OldPersistedNamespaces

        const newPersistedNamespaces = Object.entries(persistedNamespaces).reduce((acc, [dappOriginUrl, supported]) => {
            acc[dappOriginUrl] = { supported, required: {}, optional: {} }
            return acc
        }, {} as NewPersistedNamespaces)

        state[profileId] = newPersistedNamespaces
        return state
    })
    return Promise.resolve()
}
