import { DEFAULT_ISC_CHAINS_CONFIGURATIONS, SupportedStardustNetworkId } from '@core/network'
import { IPersistedProfile } from '@core/profile/interfaces'

export function addDefaultIscChainsToIotaProfiles(profile: IPersistedProfile): void {
    if (profile.network.id !== SupportedStardustNetworkId.Iota) {
        return
    }

    const chainConfiguration = DEFAULT_ISC_CHAINS_CONFIGURATIONS[SupportedStardustNetworkId.Iota]

    profile.network = {
        ...profile.network,
        chainConfigurations: chainConfiguration ? [chainConfiguration] : [],
    }
}
