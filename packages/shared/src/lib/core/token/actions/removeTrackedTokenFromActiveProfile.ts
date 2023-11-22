import { getActiveProfile, updateActiveProfile } from '@core/profile/stores'
import { NetworkId } from '@core/network/types'
import { TokenTrackingStatus } from '../enums'

export function removeTrackedTokenFromActiveProfile(tokenAddress: string, networkId: NetworkId): void {
    const profile = getActiveProfile()
    if (!profile) {
        return
    }

    const trackedTokens = profile.trackedTokens ?? {}
    const trackedTokensPerNetwork = trackedTokens[networkId] ?? {}
    profile.trackedTokens = {
        ...trackedTokens,
        [networkId]: {
            ...trackedTokensPerNetwork,
            [tokenAddress]: TokenTrackingStatus.Untracked,
        },
    }

    updateActiveProfile(profile)
}
