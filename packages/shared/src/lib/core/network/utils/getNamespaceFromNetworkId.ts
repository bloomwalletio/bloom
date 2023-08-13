import { NetworkNamespace } from '../enums'
import { NetworkId } from '../types'

export function getNamespaceFromNetworkId(networkId: NetworkId): NetworkNamespace | undefined {
    const namespace = networkId.split(':')?.[0]
    if (namespace) {
        return namespace as NetworkNamespace
    } else {
        return undefined
    }
}
