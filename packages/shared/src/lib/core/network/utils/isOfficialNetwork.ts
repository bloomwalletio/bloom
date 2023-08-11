import { SupportedNetworkId } from '../enums'
import { NetworkIdType } from '../types'

/**
 * Determines whether the network id is 'official', meaning
 * the IOTA Foundation hosts nodes publicly for that network.
 * @method isOfficialNetwork
 * @param {NetworkIdType} networkId
 * @returns {boolean}
 */
export function isOfficialNetwork(networkId: NetworkIdType): boolean {
    return Object.values(SupportedNetworkId).some((_networkId) => _networkId === networkId)
}
