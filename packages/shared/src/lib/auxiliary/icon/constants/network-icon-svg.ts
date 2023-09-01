import { IconName } from '@bloomwalletio/ui'
import { SupportedNetworkId } from '@core/network'

// TODO: rename
export const NETWORK_ICON_SVG: { [id in SupportedNetworkId]: IconName } = {
    [SupportedNetworkId.Shimmer]: IconName.Shimmer,
    [SupportedNetworkId.Testnet]: IconName.Shimmer,
    [SupportedNetworkId.ShimmerEvm]: IconName.ShimmerEvm,
    [SupportedNetworkId.ShimmerEvmTestnet]: IconName.ShimmerEvm,
}
