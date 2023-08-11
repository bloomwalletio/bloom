import { NetworkNamespace } from '../enums'
import { NetworkIdType } from '../types'

export function getNamespaceFromNetworkId(networkId: NetworkIdType): NetworkNamespace | undefined {
    const namespace = networkId.split(':')?.[0]
    if (namespace) {
        return namespace as NetworkNamespace
    } else {
        return undefined
    }
}
