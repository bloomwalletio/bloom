import { DappVerification } from '@auxiliary/wallet-connect/enums'
import { persistedDappNamespaces, persistedDapps } from '@auxiliary/wallet-connect/stores'
import { DEFAULT_BASE_TOKEN } from '@core/network/constants'
import { IPersistedProfile } from '@core/profile/interfaces'
import { IBaseToken } from '@core/token/interfaces'
import { persistedTokens } from '@core/token/stores'
import { get } from 'svelte/store'

export function prodProfileMigration8To9(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    const namespaces = get(persistedDappNamespaces)[profile.id] ?? {}

    persistedDapps.update((state) => {
        if (!state[profile.id]) {
            state[profile.id] = {}
        }
        for (const dappUrl of Object.keys(namespaces)) {
            if (state[profile.id][dappUrl]) {
                continue
            }

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

    profile.evmNetworks = (profile.evmNetworks ?? []).map((evmNetwork) => ({
        ...evmNetwork,
        baseToken: DEFAULT_BASE_TOKEN[evmNetwork.id] as IBaseToken,
    }))

    const updatedChainConfiguration = (profile.network.chainConfigurations ?? []).map((chain) => ({
        ...chain,
        baseToken: DEFAULT_BASE_TOKEN[chain.id] as IBaseToken,
    }))

    profile.network = {
        ...profile.network,
        chainConfigurations: updatedChainConfiguration,
    }

    persistedTokens.update((state) => {
        delete state[profile.id]
        return state
    })
    return Promise.resolve()
}
