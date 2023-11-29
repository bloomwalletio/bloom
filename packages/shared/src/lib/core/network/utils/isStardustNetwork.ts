import { NetworkNamespace } from '../enums'
import { NetworkId } from '../types'
import { getSplitNetworkId } from './getSplitNetworkId'

export function isStardustNetwork(networkId: NetworkId): boolean {
    return getSplitNetworkId(networkId)?.namespace === NetworkNamespace.Stardust
}
