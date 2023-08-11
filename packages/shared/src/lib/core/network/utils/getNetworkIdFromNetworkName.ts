import { NetworkNamespace, TangleNetworkId } from '../enums'
import { INetworkId } from '../interfaces'
import { NetworkProtocolId } from '../types'
import { buildNetworkId } from './buildNetworkId'

export function getNetworkIdFromNetworkName(name: string): INetworkId {
    const namespace = NetworkNamespace.Tangle
    const protocolId = getProtocolIdFromNetworkName(name)
    const id = buildNetworkId(namespace, protocolId)
    return {
        id,
        namespace,
        protocolId,
    }
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
