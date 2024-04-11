import { NetworkId, SupportedStardustNetworkId, StardustNetworkName } from '@core/network'

export const NETWORK_NAME_TO_STARDUST_NETWORK_ID_MAP: Record<string, NetworkId> = {
    [SupportedStardustNetworkId.Iota]: SupportedStardustNetworkId.Iota,
    iota: SupportedStardustNetworkId.Iota,
    [StardustNetworkName.Shimmer]: SupportedStardustNetworkId.Shimmer,
    [StardustNetworkName.Testnet]: SupportedStardustNetworkId.Testnet,
    testnet: SupportedStardustNetworkId.Testnet,
}
