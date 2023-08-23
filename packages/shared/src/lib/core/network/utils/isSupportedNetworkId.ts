import { SupportedNetworkId } from '../enums'
import { NetworkId } from '../types'

export function isSupportedNetworkId(networkId: NetworkId): boolean {
    return Object.values(SupportedNetworkId).includes(networkId as SupportedNetworkId)
}
