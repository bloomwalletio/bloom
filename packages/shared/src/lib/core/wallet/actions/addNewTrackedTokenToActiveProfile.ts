import { NetworkId } from '@core/network/types'
import { getActiveProfile, updateActiveProfile } from '@core/profile/stores'
import { TokenTrackingStatus } from '@core/token'
import { IErc20Metadata } from '@core/token/interfaces'
import { updatePersistedToken } from '@core/token/stores'
import { buildPersistedTokenFromMetadata } from '@core/token/utils'

export function addNewTrackedTokenToActiveProfile(
    networkId: NetworkId,
    tokenAddress: string,
    tokenMetadata: IErc20Metadata,
    tokenTrackingStatus: TokenTrackingStatus
): void {
    const profile = getActiveProfile()
    if (!profile) {
        return
    }

    const trackedTokensOnProfile = profile.trackedTokens ?? {}
    const trackedTokens = trackedTokensOnProfile[networkId] ?? {}
    if (!(tokenAddress in trackedTokens) || trackedTokens[tokenAddress] === TokenTrackingStatus.Untracked) {
        trackedTokens[tokenAddress] = tokenTrackingStatus
        profile.trackedTokens = { ...trackedTokensOnProfile, [networkId]: trackedTokens }

        updatePersistedToken(networkId, buildPersistedTokenFromMetadata(tokenAddress, tokenMetadata))
        updateActiveProfile(profile)
    }
}
