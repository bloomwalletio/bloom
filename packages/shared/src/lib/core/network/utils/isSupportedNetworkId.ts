import { SupportedNetworkId } from '../constants'
import { NetworkId } from '../types'

export function isSupportedNetworkId(networkId: NetworkId): boolean {
    return Object.values(SupportedNetworkId).includes(networkId)
}
