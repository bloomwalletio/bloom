import { NetworkIdType, NetworkProtocolId } from '../types'

export function getProtocolIdFromNetworkId(networkId: NetworkIdType): NetworkProtocolId | undefined {
    const protocolId = networkId.split(':')?.[1]
    if (protocolId) {
        return protocolId as NetworkProtocolId
    } else {
        return undefined
    }
}
