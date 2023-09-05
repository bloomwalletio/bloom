import { IconName } from '@bloomwalletio/ui'
import { SupportedNetworkId } from '@core/network'

export const DEFAULT_NETWORK_ICON: { [id in SupportedNetworkId]: IconName } = {
    [SupportedNetworkId.Shimmer]: IconName.Shimmer,
    [SupportedNetworkId.Testnet]: IconName.Shimmer,
    [SupportedNetworkId.ShimmerEvm]: IconName.ShimmerEvm,
    [SupportedNetworkId.ShimmerEvmTestnet]: IconName.ShimmerEvm,
}
