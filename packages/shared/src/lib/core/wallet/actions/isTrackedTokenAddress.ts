import { NetworkId } from '@core/network/types'
import { getActiveProfile } from '@core/profile/stores'
import { TokenTrackingStatus } from '@core/token/enums'

export function isTrackedTokenAddress(networkId: NetworkId, address: string): boolean {
    const trackedTokens = getActiveProfile()?.trackedTokens?.[networkId] ?? {}
    return trackedTokens[address] !== TokenTrackingStatus.Untracked
}
