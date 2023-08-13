import { NetworkId, NetworkProtocolId } from '../types'

export function getProtocolIdFromNetworkId(networkId: NetworkId): NetworkProtocolId | undefined {
    const protocolId = networkId.split(':')?.[1]
    if (protocolId) {
        return protocolId as NetworkProtocolId
    } else {
        return undefined
    }
}
