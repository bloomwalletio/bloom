import { SupportedNetworkId } from '../enums'

export const IOTA_COIN_TYPE = 4218
export const SHIMMER_COIN_TYPE = 4219
export const TEST_COIN_TYPE = 1
export const ETHEREUM_COIN_TYPE = 60

export const DEFAULT_COIN_TYPE: Readonly<{ [id in SupportedNetworkId]: number }> = {
    [SupportedNetworkId.Iota]: IOTA_COIN_TYPE,
    [SupportedNetworkId.Shimmer]: SHIMMER_COIN_TYPE,
    [SupportedNetworkId.Testnet]: TEST_COIN_TYPE,
    [SupportedNetworkId.IotaEvm]: ETHEREUM_COIN_TYPE,
    [SupportedNetworkId.ShimmerEvm]: ETHEREUM_COIN_TYPE,
    [SupportedNetworkId.TestnetEvm]: ETHEREUM_COIN_TYPE,
}
