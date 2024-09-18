import { SupportedStardustNetworkId, StardustNetworkName, StardustNetworkId } from '@core/network'

export const NETWORK_NAME_TO_STARDUST_NETWORK_ID_MAP: Record<string, StardustNetworkId> = {
    [SupportedStardustNetworkId.Iota]: SupportedStardustNetworkId.Iota,
    [SupportedStardustNetworkId.IotaTestnet]: SupportedStardustNetworkId.IotaTestnet,
    iota: SupportedStardustNetworkId.Iota,
    [StardustNetworkName.Shimmer]: SupportedStardustNetworkId.Shimmer,
    [StardustNetworkName.Testnet]: SupportedStardustNetworkId.Testnet,
    testnet: SupportedStardustNetworkId.Testnet,
}
