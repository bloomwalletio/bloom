import { EvmChainId, TangleNetworkId } from '../enums'
import { NetworkIdType } from '../types'
import { buildEthereumNetworkId, buildTangleNetworkId } from '../utils'

export const TEST_COIN_TYPE = 1
export const ETHEREUM_COIN_TYPE = 60
export const IOTA_COIN_TYPE = 4218
export const SHIMMER_COIN_TYPE = 4219

export const COIN_TYPE: Readonly<{ [id: NetworkIdType]: number }> = {
    [buildTangleNetworkId(TangleNetworkId.Iota)]: IOTA_COIN_TYPE,
    [buildTangleNetworkId(TangleNetworkId.Shimmer)]: SHIMMER_COIN_TYPE,
    [buildTangleNetworkId(TangleNetworkId.Testnet)]: TEST_COIN_TYPE,
    [buildEthereumNetworkId(EvmChainId.ShimmerEvm)]: ETHEREUM_COIN_TYPE,
    [buildEthereumNetworkId(EvmChainId.ShimmerEvmTestnet)]: TEST_COIN_TYPE,
}
