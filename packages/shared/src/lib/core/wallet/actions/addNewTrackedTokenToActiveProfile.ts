import { NetworkId } from '@core/network/types'
import { getActiveProfile, updateActiveProfile } from '@core/profile/stores'
import { IErc20Metadata } from '@core/token/interfaces'
import { updatePersistedToken } from '@core/token/stores'
import { buildPersistedTokenFromMetadata } from '@core/token/utils'

export function addNewTrackedTokenToActiveProfile(
    networkId: NetworkId,
    tokenAddress: string,
    tokenMetadata: IErc20Metadata
): void {
    const profile = getActiveProfile()
    if (!profile) {
        return
    }

    const trackedTokensOnProfile = profile.trackedTokens ?? {}
    const trackedTokens = trackedTokensOnProfile[networkId] ?? []
    if (!trackedTokens.includes(tokenAddress)) {
        trackedTokens.push(tokenAddress)
        profile.trackedTokens = { ...trackedTokensOnProfile, [networkId]: trackedTokens }
        updatePersistedToken(buildPersistedTokenFromMetadata(tokenAddress, tokenMetadata))
        updateActiveProfile(profile)
    }
}
