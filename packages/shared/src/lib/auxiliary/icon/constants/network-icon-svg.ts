import { buildEthereumNetworkId, buildTangleNetworkId, EvmChainId, NetworkIdType, TangleNetworkId } from '@core/network'

import { Icon } from '../enums'

export const NETWORK_ICON_SVG: { [id: NetworkIdType]: Icon } = {
    [buildTangleNetworkId(TangleNetworkId.Iota)]: Icon.Iota,
    [buildTangleNetworkId(TangleNetworkId.Shimmer)]: Icon.Shimmer,
    [buildTangleNetworkId(TangleNetworkId.Testnet)]: Icon.Shimmer,
    [buildEthereumNetworkId(EvmChainId.ShimmerEvm)]: Icon.ShimmerEvm,
    [buildEthereumNetworkId(EvmChainId.ShimmerEvmTestnet)]: Icon.ShimmerEvm,
}
