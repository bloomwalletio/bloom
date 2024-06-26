import { persistent } from '@core/utils/store'
import { Writable, get } from 'svelte/store'
import { SupportedNamespaces } from '../types'
import { getActiveProfileId } from '@core/profile/stores'
import { IPersistedNamespaces } from '../interface'
import { DappVerification } from '../enums'

interface IPersistedDappStore {
    [profileId: string]: {
        [dappOriginUrl: string]: {
            verificationState: DappVerification
            namespaces: IPersistedNamespaces
        }
    }
}

export const persistedDapps: Writable<IPersistedDappStore> = persistent('persistedDapps', {})

export function getPersistedDapp(dappOriginUrl: string):
    | {
          verificationState: DappVerification
          namespaces: IPersistedNamespaces
      }
    | undefined {
    const profileId = getActiveProfileId()
    return get(persistedDapps)?.[profileId]?.[dappOriginUrl]
}

export function getPersistedDappNamespacesForDapp(dappOriginUrl: string): IPersistedNamespaces | undefined {
    return getPersistedDapp(dappOriginUrl)?.namespaces
}

export function persistDapp(
    dappOriginUrl: string,
    verificationState: DappVerification,
    namespaces: IPersistedNamespaces
): void {
    const profileId = getActiveProfileId()

    return persistedDapps.update((state) => {
        if (!state[profileId]) {
            state[profileId] = {}
        }
        state[profileId][dappOriginUrl] = {
            verificationState,
            namespaces,
        }

        return state
    })
}

export function updateSupportedDappNamespacesForDapp(dappOriginUrl: string, supported: SupportedNamespaces): void {
    const profileId = getActiveProfileId()

    return persistedDapps.update((state) => {
        const persistedDapp = state?.[profileId]?.[dappOriginUrl]
        if (!persistedDapp) {
            return state
        }

        const updatedNamespaces = {
            ...persistedDapp.namespaces,
            supported: { ...persistedDapp.namespaces.supported, ...supported },
        }

        state[profileId][dappOriginUrl] = {
            ...persistedDapp,
            namespaces: updatedNamespaces,
        }
        return state
    })
}
export function updateVerificationStateForDapp(dappOriginUrl: string, verificationState: DappVerification): void {
    const profileId = getActiveProfileId()

    return persistedDapps.update((state) => {
        const persistedDapp = state?.[profileId]?.[dappOriginUrl]
        if (!persistedDapp) {
            return state
        }

        state[profileId][dappOriginUrl] = {
            ...persistedDapp,
            verificationState,
        }
        return state
    })
}

export function removePersistedDapp(dappOriginUrl: string): void {
    const profileId = getActiveProfileId()

    return persistedDapps.update((state) => {
        if (!state[profileId]) {
            return state
        }
        delete state[profileId][dappOriginUrl]
        return state
    })
}
