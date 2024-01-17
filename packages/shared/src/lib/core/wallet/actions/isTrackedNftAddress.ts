import { NetworkId } from '@core/network/types'
import { getActiveProfile } from '@core/profile/stores'
import { TokenTrackingStatus } from '@core/token/enums'

export function isTrackedNftAddress(networkId: NetworkId, address: string): boolean {
    const trackedNfts = getActiveProfile()?.trackedNfts?.[networkId] ?? {}
    return Object.keys(trackedNfts).some((key) => {
        if (!key.toLowerCase().startsWith(address.toLowerCase())) {
            return false
        }
        const trackedStatus = trackedNfts[key]
        return (
            trackedStatus === TokenTrackingStatus.AutomaticallyTracked ||
            trackedStatus === TokenTrackingStatus.ManuallyTracked
        )
    })
}
