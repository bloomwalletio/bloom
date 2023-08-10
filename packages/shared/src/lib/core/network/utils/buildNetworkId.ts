import { EvmChainId, NetworkNamespace, TangleNetworkId } from '../enums'
import { NetworkIdType, NetworkProtocolId } from '../types'

export function buildTangleNetworkId(protocolId: TangleNetworkId | string): NetworkIdType {
    return buildNetworkId(NetworkNamespace.Tangle, protocolId)
}

export function buildEthereumNetworkId(protocolId: EvmChainId): NetworkIdType {
    return buildNetworkId(NetworkNamespace.Ethereum, protocolId)
}

export function buildNetworkId(namespace: NetworkNamespace, protocolId: NetworkProtocolId): NetworkIdType {
    if (namespace && protocolId) {
        /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
        return `${namespace}:${protocolId}` as NetworkIdType
    }
}
