import { persistent } from '@core/utils/store'
import { Writable, get } from 'svelte/store'
import { SupportedNamespaces } from '../types'
import { getActiveProfileId } from '@core/profile/stores'
import { DappVerification } from '../enums'
import { ProposalTypes } from '@walletconnect/types'

interface IPersistedDappStore {
    [dappOriginUrl: string]: {
        verificationState: DappVerification
        required: ProposalTypes.RequiredNamespaces
        optional: ProposalTypes.OptionalNamespaces
        supported: {
            [profileId: string]: SupportedNamespaces
        }
    }
}

export const persistedDapps: Writable<IPersistedDappStore> = persistent('persistedDapps', {})

export function getPersistedDapp(dappOriginUrl: string):
    | {
          verificationState: DappVerification
          required: ProposalTypes.RequiredNamespaces
          optional: ProposalTypes.OptionalNamespaces
          supported: SupportedNamespaces | undefined
      }
    | undefined {
    const profileId = getActiveProfileId()
    const persistedDapp = get(persistedDapps)?.[dappOriginUrl]
    if (!persistedDapp) {
        return undefined
    }

    return {
        verificationState: persistedDapp.verificationState,
        required: persistedDapp.required,
        optional: persistedDapp.optional,
        supported: persistedDapp.supported[profileId],
    }
}

export function getPersistedDappNamespacesForDapp(dappOriginUrl: string): SupportedNamespaces | undefined {
    return getPersistedDapp(dappOriginUrl)?.supported
}

export function persistDapp(
    dappOriginUrl: string,
    verificationState: DappVerification,
    required: ProposalTypes.RequiredNamespaces,
    optional: ProposalTypes.OptionalNamespaces,
    supported: SupportedNamespaces
): void {
    const profileId = getActiveProfileId()

    return persistedDapps.update((state) => {
        state[dappOriginUrl] = {
            verificationState,
            required,
            optional,
            supported: {
                ...(state[dappOriginUrl]?.supported ?? {}),
                [profileId]: supported,
            },
        }

        return state
    })
}

export function updateSupportedDappNamespacesForDapp(dappOriginUrl: string, supported: SupportedNamespaces): void {
    const profileId = getActiveProfileId()

    return persistedDapps.update((state) => {
        const persistedDapp = state?.[dappOriginUrl]
        if (!persistedDapp) {
            return state
        }

        const updatedNamespaces = {
            ...persistedDapp,
            supported: { ...persistedDapp.supported, [profileId]: supported },
        }

        state[profileId][dappOriginUrl] = {
            ...persistedDapp,
            namespaces: updatedNamespaces,
        }
        return state
    })
}

export function updateVerificationStateForDapp(dappOriginUrl: string, verificationState: DappVerification): void {
    return persistedDapps.update((state) => {
        const persistedDapp = state?.[dappOriginUrl]
        if (!persistedDapp) {
            return state
        }

        state[dappOriginUrl] = {
            ...persistedDapp,
            verificationState,
        }
        return state
    })
}

export function removePersistedDapp(dappOriginUrl: string): void {
    return persistedDapps.update((state) => {
        delete state[dappOriginUrl]
        return state
    })
}
