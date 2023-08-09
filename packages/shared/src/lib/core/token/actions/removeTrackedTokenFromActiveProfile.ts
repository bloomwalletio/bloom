import { getActiveProfile, updateActiveProfile } from '@core/profile/stores'
import { removePersistedAsset } from '../stores'

export function removeTrackedTokenFromActiveProfile(tokenAddress: string, chainId: number): void {
    const profile = getActiveProfile()
    if (!profile) {
        return
    }

    const trackedTokens = profile.trackedTokens ?? {}
    trackedTokens[chainId] = trackedTokens[chainId]?.filter(
        (trackedTokenAddress) => tokenAddress !== trackedTokenAddress
    )
    profile.trackedTokens = trackedTokens
    updateActiveProfile(profile)
    removePersistedAsset(tokenAddress)
}
