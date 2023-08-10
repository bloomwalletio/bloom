import { NetworkNamespace, TangleNetworkId } from '../enums'
import { buildNetworkId } from '../utils'

export const SHIMMER_NETWORK_ID = buildNetworkId(NetworkNamespace.Tangle, TangleNetworkId.Shimmer)
export const TESTNET_NETWORK_ID = buildNetworkId(NetworkNamespace.Tangle, TangleNetworkId.Testnet)
