import { getActiveProfile, updateActiveProfile } from '@core/profile/stores'
import { removePersistedAsset } from '@core/wallet/stores'

export function removeTokenFromActiveProfileTrackedTokens(tokenAddress: string, chainId: number): void {
    const profile = getActiveProfile()
    if (!profile) {
        return
    }

    const trackedTokens = profile.trackedTokens ?? {}
    trackedTokens[chainId] = trackedTokens[chainId]?.filter(
        (trackedTokenAddress: string) => tokenAddress !== trackedTokenAddress
    )
    profile.trackedTokens = trackedTokens
    updateActiveProfile(profile)
    removePersistedAsset(tokenAddress)
}
