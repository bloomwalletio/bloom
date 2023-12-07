import { NetworkId } from '@core/network/types'
import { getActiveProfile, updateActiveProfile } from '@core/profile/stores'
import { TokenTrackingStatus } from '@core/token/enums'

export function addNewTrackedNftToActiveProfile(
    networkId: NetworkId,
    nftAddress: string,
    trackingStatus: TokenTrackingStatus
): void {
    const profile = getActiveProfile()
    if (!profile) {
        return
    }

    const trackedNftsOnProfile = profile.trackedNfts ?? {}
    const trackedNftsPerNetwork = trackedNftsOnProfile[networkId] ?? {}
    if (!(nftAddress in trackedNftsPerNetwork) || trackedNftsPerNetwork[nftAddress] === TokenTrackingStatus.Untracked) {
        trackedNftsPerNetwork[nftAddress] = trackingStatus
        profile.trackedNfts = { ...trackedNftsOnProfile, [networkId]: trackedNftsPerNetwork }
        updateActiveProfile(profile)
    }
}
