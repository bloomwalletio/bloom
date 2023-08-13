import { NetworkNamespace, TangleNetworkId } from '../enums'
import { NetworkId, NetworkProtocolId } from '../types'
import { buildNetworkId } from './buildNetworkId'

export function getNetworkIdFromNetworkName(name: string): NetworkId {
    const namespace = NetworkNamespace.Tangle
    const protocolId = getProtocolIdFromNetworkName(name)
    return buildNetworkId(namespace, protocolId)
}

//  TODO: Type this correctly to NetworkName
function getProtocolIdFromNetworkName(name: string): NetworkProtocolId {
    switch (name) {
        case 'shimmer':
            return TangleNetworkId.Shimmer
        case 'testnet':
        case 'testnet-1':
            return TangleNetworkId.Testnet
        default:
            // TODO: https://github.com/iotaledger/tips/blob/main/tips/TIP-0020/tip-0020.md#network-id
            return 'custom'
    }
}
