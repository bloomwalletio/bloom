import { NetworkNamespace } from '../enums'
import { EvmNetworkId, NetworkId } from '../types'
import { getSplitNetworkId } from './getSplitNetworkId'

export function isEvmNetwork(networkId: NetworkId | undefined): networkId is EvmNetworkId {
    if (!networkId) {
        return false
    }
    return getSplitNetworkId(networkId)?.namespace === NetworkNamespace.Evm
}
