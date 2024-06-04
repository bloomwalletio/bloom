import { IconName } from '@bloomwalletio/ui'
import { NetworkId, SupportedNetworkId } from '@core/network'

export const DEFAULT_NETWORK_ICON: { [id in NetworkId]?: IconName } = {
    [SupportedNetworkId.Iota]: IconName.Iota,
    [SupportedNetworkId.Shimmer]: IconName.Shimmer,
    [SupportedNetworkId.IotaTestnet]: IconName.Iota,
    [SupportedNetworkId.Testnet]: IconName.Shimmer,
    [SupportedNetworkId.IotaEvm]: IconName.Iota,
    [SupportedNetworkId.ShimmerEvm]: IconName.Shimmer,
    [SupportedNetworkId.IotaTestnetEvm]: IconName.Iota,
    [SupportedNetworkId.TestnetEvm]: IconName.Shimmer,
    [SupportedNetworkId.Ethereum]: IconName.Ethereum,
    [SupportedNetworkId.Sepolia]: IconName.Ethereum,
    [SupportedNetworkId.GenericEvm]: IconName.Ethereum,
}
