import { NetworkId, StardustNetworkId, StardustNetworkName } from '@core/network'

export const NETWORK_NAME_TO_STARDUST_NETWORK_ID_MAP: Record<string, NetworkId> = {
    [StardustNetworkId.Iota]: StardustNetworkId.Iota,
    iota: StardustNetworkId.Iota,
    [StardustNetworkName.Shimmer]: StardustNetworkId.Shimmer,
    [StardustNetworkName.Testnet]: StardustNetworkId.Testnet,
    testnet: StardustNetworkId.Testnet,
}
