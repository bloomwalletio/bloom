import { DEFAULT_BASE_TOKEN } from '@core/network'
import { IPersistedProfile } from '@core/profile/interfaces'
import { IBaseToken } from '@core/token'
import { persistedTokens } from '@core/token/stores'

export function alphaProfileMigration16To17(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    profile.evmNetworks = (profile.evmNetworks ?? []).map((evmNetwork) => ({
        ...evmNetwork,
        baseToken: DEFAULT_BASE_TOKEN[evmNetwork.id] as IBaseToken,
    }))
    persistedTokens.update((state) => {
        delete state[profile.id]
        return state
    })
    return Promise.resolve()
}
