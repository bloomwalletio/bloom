import { EvmChainId, NetworkNamespace, StardustNetworkName } from '../enums'
import { NetworkId } from '../types'

type SpitNetworkId =
    | { namespace: NetworkNamespace.Stardust; networkName: StardustNetworkName | string }
    | { namespace: NetworkNamespace.Evm; chainId: EvmChainId }

export function getSplitNetworkId(networkId: NetworkId): SpitNetworkId | undefined {
    const parts = networkId?.split(':')
    if ((parts?.[0] as NetworkNamespace) === NetworkNamespace.Stardust && parts?.[1]) {
        return {
            namespace: NetworkNamespace.Stardust,
            networkName: parts[1],
        }
    } else if ((parts?.[0] as NetworkNamespace) === NetworkNamespace.Evm && parts?.[1]) {
        return {
            namespace: NetworkNamespace.Evm,
            chainId: parts[1] as EvmChainId,
        }
    } else {
        return undefined
    }
}
