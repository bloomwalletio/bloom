import { getActiveProfile, updateActiveProfile } from '@core/profile/stores'
import { NetworkId } from '@core/network/types'
import { removePersistedToken } from '../stores'

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

    const untrackedTokens = profile.untrackedTokens ?? {}
    if (networkId in untrackedTokens) {
        untrackedTokens[networkId][tokenAddress] = undefined
    } else {
        untrackedTokens[networkId] = { [tokenAddress]: undefined }
    }
    profile.untrackedTokens = untrackedTokens

    updateActiveProfile(profile)
    removePersistedToken(tokenAddress)
}
