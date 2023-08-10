import { EvmChainId, NetworkNamespace, TangleNetworkId } from '../enums'
import { NetworkIdType } from '../types'
import { buildNetworkId } from '../utils'

export const TEST_COIN_TYPE = 1
export const ETHEREUM_COIN_TYPE = 60
export const IOTA_COIN_TYPE = 4218
export const SHIMMER_COIN_TYPE = 4219

export const COIN_TYPE: Readonly<{ [id: NetworkIdType]: number }> = {
    [buildNetworkId(NetworkNamespace.Tangle, TangleNetworkId.Iota)]: IOTA_COIN_TYPE,
    [buildNetworkId(NetworkNamespace.Tangle, TangleNetworkId.Shimmer)]: SHIMMER_COIN_TYPE,
    [buildNetworkId(NetworkNamespace.Tangle, TangleNetworkId.Testnet)]: TEST_COIN_TYPE,
    [buildNetworkId(NetworkNamespace.Ethereum, EvmChainId.ShimmerEvm)]: ETHEREUM_COIN_TYPE,
    [buildNetworkId(NetworkNamespace.Ethereum, EvmChainId.ShimmerEvmTestnet)]: TEST_COIN_TYPE,
}
