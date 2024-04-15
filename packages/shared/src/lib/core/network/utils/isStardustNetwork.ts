import { NetworkNamespace } from '../enums'
import { NetworkId, StardustNetworkId } from '../types'
import { getSplitNetworkId } from './getSplitNetworkId'

export function isStardustNetwork(networkId: NetworkId): networkId is StardustNetworkId {
    return getSplitNetworkId(networkId)?.namespace === NetworkNamespace.Stardust
}
