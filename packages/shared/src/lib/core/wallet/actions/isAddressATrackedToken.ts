import { NetworkId } from '@core/network/types'
import { IProfile } from '@core/profile'

export function isAddressATrackedToken(networkId: NetworkId, address: string, profile: IProfile): boolean {
    const trackedTokens = profile.trackedTokens?.[networkId] ?? []
    return trackedTokens.includes(address)
}
