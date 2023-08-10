import { INetworkId } from '../interfaces'
import { NetworkIdType } from '../types'
import { buildNetworkId, EvmChainId, NetworkNamespace, TangleNetworkId } from '@core/network'

export function parseNetworkId(networkId: NetworkIdType): INetworkId | undefined {
    if (networkId) {
        const [namespace, protocolId] = <string>networkId.split(':')
        if (namespace === NetworkNamespace.Tangle) {
            if (protocolId in TangleNetworkId || !(protocolId in EvmChainId)) {
                return {
                    id: buildNetworkId(namespace as NetworkNamespace, protocolId),
                    namespace,
                    protocolId,
                } as INetworkId
            }
        } else if (namespace === NetworkNamespace.Ethereum) {
            if (protocolId in EvmChainId) {
                return {
                    id: buildNetworkId(namespace as NetworkNamespace, protocolId),
                    namespace,
                    protocolId,
                } as INetworkId
            }
        }
    }
}
