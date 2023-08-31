import { ExplorerEndpoint, SupportedNetworkId } from '../enums'
import { NetworkId } from '../types'

export const EXPLORER_ENDPOINTS: Readonly<{ [key in NetworkId]?: { [key in ExplorerEndpoint]?: string } }> = {
    [SupportedNetworkId.Shimmer]: {
        [ExplorerEndpoint.Transaction]: ExplorerEndpoint.Transaction,
        [ExplorerEndpoint.Nft]: ExplorerEndpoint.Nft,
    },
    [SupportedNetworkId.Testnet]: {
        [ExplorerEndpoint.Transaction]: ExplorerEndpoint.Transaction,
        [ExplorerEndpoint.Nft]: ExplorerEndpoint.Nft,
    },
    [SupportedNetworkId.ShimmerEvm]: {
        [ExplorerEndpoint.Transaction]: 'tx',
    },
    [SupportedNetworkId.ShimmerEvmTestnet]: {
        [ExplorerEndpoint.Transaction]: 'tx',
    },
}
