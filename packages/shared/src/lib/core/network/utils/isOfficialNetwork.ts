import { SupportedNetworkId } from '../enums'
import { NetworkId } from '../types'

/**
 * Determines whether the network id is 'official', meaning
 * the IOTA Foundation hosts nodes publicly for that network.
 * @method isOfficialNetwork
 * @param {NetworkId} networkId
 * @returns {boolean}
 */
export function isOfficialNetwork(networkId: NetworkId): boolean {
    return Object.values(SupportedNetworkId).some((_networkId) => _networkId === networkId)
}
