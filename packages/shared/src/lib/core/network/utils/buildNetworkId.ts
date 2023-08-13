import { EvmChainId, NetworkNamespace, TangleNetworkId } from '../enums'
import { NetworkId, NetworkProtocolId } from '../types'

export function buildTangleNetworkId(protocolId: TangleNetworkId | string): NetworkId {
    return buildNetworkId(NetworkNamespace.Tangle, protocolId)
}

export function buildEthereumNetworkId(protocolId: EvmChainId): NetworkId {
    return buildNetworkId(NetworkNamespace.Ethereum, protocolId)
}

export function buildNetworkId(namespace: NetworkNamespace, protocolId: NetworkProtocolId): NetworkId {
    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    return `${namespace}:${protocolId}` as NetworkId
}
