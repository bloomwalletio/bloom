import { DEFAULT_BASE_TOKEN } from '@core/network'
import { IPersistedProfile } from '@core/profile/interfaces'
import { IBaseToken } from '@core/token'
import { persistedTokens } from '@core/token/stores'

export function alphaProfileMigration17To18(existingProfile: unknown): Promise<void> {
    const profile = existingProfile as IPersistedProfile

    const updatedChainConfiguration = (profile.network.chainConfigurations ?? []).map((chain) => ({
        ...chain,
        baseToken: (DEFAULT_BASE_TOKEN[chain.id] as IBaseToken) ?? chain.baseToken,
    }))

    profile.network = { ...profile.network, chainConfigurations: updatedChainConfiguration }

    persistedTokens.update((state) => {
        delete state[profile.id]
        return state
    })
    return Promise.resolve()
}
