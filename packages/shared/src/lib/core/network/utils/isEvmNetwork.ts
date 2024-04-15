import { NetworkNamespace } from '../enums'
import { EvmNetworkId, NetworkId } from '../types'
import { getSplitNetworkId } from './getSplitNetworkId'

export function isEvmNetwork(networkId: NetworkId): networkId is EvmNetworkId {
    return getSplitNetworkId(networkId)?.namespace === NetworkNamespace.Evm
}
