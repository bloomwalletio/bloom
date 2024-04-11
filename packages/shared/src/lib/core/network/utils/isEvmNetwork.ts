import { NetworkNamespace } from '../enums'
import { NetworkId } from '../types'
import { getSplitNetworkId } from './getSplitNetworkId'

export function isEvmNetwork(networkId: NetworkId): boolean {
    return getSplitNetworkId(networkId)?.namespace === NetworkNamespace.Evm
}
