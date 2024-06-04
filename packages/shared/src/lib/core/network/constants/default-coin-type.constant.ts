import { NetworkId } from '../types'
import { SupportedNetworkId } from './supported-network-id.constant'

export const IOTA_COIN_TYPE = 4218
export const SHIMMER_COIN_TYPE = 4219
export const TEST_COIN_TYPE = 1
export const ETHEREUM_COIN_TYPE = 60

export const DEFAULT_COIN_TYPE: Readonly<{ [key in NetworkId]: number }> = {
    [SupportedNetworkId.Iota]: IOTA_COIN_TYPE,
    [SupportedNetworkId.Shimmer]: SHIMMER_COIN_TYPE,
    [SupportedNetworkId.IotaTestnet]: TEST_COIN_TYPE,
    [SupportedNetworkId.Testnet]: TEST_COIN_TYPE,
    [SupportedNetworkId.IotaEvm]: ETHEREUM_COIN_TYPE,
    [SupportedNetworkId.ShimmerEvm]: ETHEREUM_COIN_TYPE,
    [SupportedNetworkId.IotaTestnetEvm]: ETHEREUM_COIN_TYPE,
    [SupportedNetworkId.TestnetEvm]: ETHEREUM_COIN_TYPE,
    [SupportedNetworkId.Ethereum]: ETHEREUM_COIN_TYPE,
    [SupportedNetworkId.Sepolia]: ETHEREUM_COIN_TYPE,
    [SupportedNetworkId.GenericEvm]: ETHEREUM_COIN_TYPE,
}
