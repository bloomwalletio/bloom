import { updateActiveProfile } from '@core/profile'
import { getActiveProfile } from '@core/profile/stores'
import { IErc20Metadata } from '@core/token/interfaces'
import { updatePersistedAsset } from '@core/token/stores'
import { buildPersistedTokenFromMetadata } from '@core/token/utils'

export function addNewTrackedTokenToActiveProfile(
    chainId: number,
    tokenAddress: string,
    tokenMetadata: IErc20Metadata
): void {
    const profile = getActiveProfile()
    if (!profile) {
        return
    }

    const trackedTokens = profile.trackedTokens ?? {}
    const chainIdTrackedTokens = trackedTokens[chainId] ?? []
    if (!chainIdTrackedTokens.includes(tokenAddress)) {
        chainIdTrackedTokens.push(tokenAddress)
        profile.trackedTokens = { ...trackedTokens, [chainId]: chainIdTrackedTokens }
        updatePersistedAsset(buildPersistedTokenFromMetadata(tokenAddress, tokenMetadata))
        updateActiveProfile(profile)
    }
}
