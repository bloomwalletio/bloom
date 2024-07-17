import { get, writable } from 'svelte/store'

import type { IPersistedAccountData } from '@core/account/interfaces'
import type { IEvmAddresses, IPureEvmNetworkConfiguration } from '@core/network/interfaces'

import { INITIAL_ACTIVE_PROFILE } from '../constants/initial-active-profile.constant'
import type { IProfile, IProfileSettings } from '../interfaces'

export const activeProfile = writable<IProfile>(<IProfile>INITIAL_ACTIVE_PROFILE)

export function getActiveProfile(): IProfile {
    return get(activeProfile)
}

export function isLoggedIn(): boolean {
    const activeProfile = getActiveProfile()
    return get(activeProfile.loggedIn)
}

export function updateActiveProfile(payload: Partial<IProfile>): void {
    activeProfile?.update((state) => ({ ...state, ...payload }))
}

export function updateActiveProfileSettings(payload: Partial<IProfileSettings>): void {
    activeProfile?.update((state) => ({
        ...state,
        settings: { ...state?.settings, ...payload },
    }))
}

export function addAccountPersistedDataToActiveProfile(
    accountIndex: number,
    accountPersistedData: IPersistedAccountData
): void {
    activeProfile?.update((state) => {
        if (!state?.accountPersistedData) {
            state.accountPersistedData = {}
        }
        state.accountPersistedData[accountIndex] = accountPersistedData
        return state
    })
}

export function getActiveProfilePersistedAccountData(accountIndex: number): IPersistedAccountData | undefined {
    return get(activeProfile)?.accountPersistedData?.[accountIndex]
}

export function updateAccountPersistedDataOnActiveProfile(
    accountIndex: number,
    partialAccountPersistedData: Partial<IPersistedAccountData>
): void {
    activeProfile?.update((state) => {
        if (!state?.accountPersistedData) {
            state.accountPersistedData = {}
        }
        state.accountPersistedData[accountIndex] = {
            ...state?.accountPersistedData?.[accountIndex],
            ...partialAccountPersistedData,
        }
        return state
    })
}

export function addPersistedEvmNetworkToActiveProfile(persistedNetwork: IPureEvmNetworkConfiguration): void {
    activeProfile?.update((state) => {
        if (!state.evmNetworks) {
            state.evmNetworks = []
        }
        if (state.evmNetworks.some((network) => network.id === persistedNetwork.id)) {
            return state
        }

        state.evmNetworks.push(persistedNetwork)
        return state
    })
}

export function getActiveProfilePersistedEvmAddressesByAccountIndex(accountIndex: number): IEvmAddresses {
    const accountPersistedData = getActiveProfilePersistedAccountData(accountIndex)
    return accountPersistedData?.evmAddresses ?? {}
}

export function removeEvmNetworkFromActiveProfile(networkId: string): void {
    activeProfile?.update((state) => {
        state.evmNetworks = state.evmNetworks.filter((network) => network.id !== networkId)
        return state
    })
}
