import { NetworkId } from '@core/network/types'
import { getActiveProfile } from '@core/profile/stores'

export function isTrackedTokenAddress(networkId: NetworkId, address: string): boolean {
    const trackedTokens = getActiveProfile().trackedTokens?.[networkId] ?? []
    return trackedTokens.map((addr) => addr.toLowerCase()).includes(address)
}
