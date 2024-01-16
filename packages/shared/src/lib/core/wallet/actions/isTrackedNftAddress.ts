import { NetworkId } from '@core/network/types'
import { getActiveProfile } from '@core/profile/stores'
import { TokenTrackingStatus } from '@core/token/enums'

export function isTrackedNftAddress(networkId: NetworkId, address: string): boolean {
    const trackedNfts = getActiveProfile()?.trackedNfts?.[networkId] ?? {}
    return (
        trackedNfts[address] === TokenTrackingStatus.AutomaticallyTracked ||
        trackedNfts[address] === TokenTrackingStatus.ManuallyTracked
    )
}
