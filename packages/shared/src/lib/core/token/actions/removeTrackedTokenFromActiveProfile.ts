import { getActiveProfile, updateActiveProfile } from '@core/profile/stores'
import { removePersistedToken } from '../stores'
import { NetworkId } from '@core/network/types'

export function removeTrackedTokenFromActiveProfile(tokenAddress: string, networkId: NetworkId): void {
    const profile = getActiveProfile()
    if (!profile) {
        return
    }

    const trackedTokens = profile.trackedTokens ?? {}
    trackedTokens[networkId] = trackedTokens[networkId]?.filter(
        (trackedTokenAddress) => tokenAddress !== trackedTokenAddress
    )
    profile.trackedTokens = trackedTokens
    updateActiveProfile(profile)
    removePersistedToken(tokenAddress)
}
