import { NetworkId } from '@core/network/types'
import { getActiveProfile, updateActiveProfile } from '@core/profile/stores'
import { TokenTrackingStatus } from '@core/token/enums'

export function addNewTrackedNftToActiveProfile(
    networkId: NetworkId,
    nftId: string,
    trackingStatus: TokenTrackingStatus
): void {
    const profile = getActiveProfile()
    if (!profile) {
        return
    }

    const trackedNftsOnProfile = profile.trackedNfts ?? {}
    const trackedNftsPerNetwork = trackedNftsOnProfile[networkId] ?? {}
    if (!(nftId in trackedNftsPerNetwork) || trackedNftsPerNetwork[nftId] === TokenTrackingStatus.Untracked) {
        trackedNftsPerNetwork[nftId] = trackingStatus
        profile.trackedNfts = { ...trackedNftsOnProfile, [networkId]: trackedNftsPerNetwork }
        updateActiveProfile(profile)
    }
}
