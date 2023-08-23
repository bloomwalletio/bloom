import { NetworkId, SupportedNetworkId } from '@core/network'

import { Icon } from '../enums'

export const NETWORK_ICON_SVG: { [id in NetworkId]: Icon } = {
    [SupportedNetworkId.Shimmer]: Icon.Shimmer,
    [SupportedNetworkId.Testnet]: Icon.Shimmer,
    [SupportedNetworkId.ShimmerEvm]: Icon.ShimmerEvm,
    [SupportedNetworkId.ShimmerEvmTestnet]: Icon.ShimmerEvm,
}
