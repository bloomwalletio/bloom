import { ExplorerEndpoint, SupportedNetworkId } from '../enums'
import { NetworkId } from '../types'

export const EXPLORER_ENDPOINTS: Readonly<{ [key in NetworkId]?: { [key in ExplorerEndpoint]?: string } }> = {
    [SupportedNetworkId.Iota]: {
        [ExplorerEndpoint.Transaction]: ExplorerEndpoint.Transaction,
        [ExplorerEndpoint.Nft]: ExplorerEndpoint.Nft,
        [ExplorerEndpoint.Address]: 'addr',
    },
    [SupportedNetworkId.Shimmer]: {
        [ExplorerEndpoint.Transaction]: ExplorerEndpoint.Transaction,
        [ExplorerEndpoint.Nft]: ExplorerEndpoint.Nft,
        [ExplorerEndpoint.Address]: 'addr',
    },
    [SupportedNetworkId.Testnet]: {
        [ExplorerEndpoint.Transaction]: ExplorerEndpoint.Transaction,
        [ExplorerEndpoint.Nft]: ExplorerEndpoint.Nft,
        [ExplorerEndpoint.Address]: 'addr',
    },
    [SupportedNetworkId.ShimmerEvm]: {
        [ExplorerEndpoint.Transaction]: 'tx',
        [ExplorerEndpoint.Address]: ExplorerEndpoint.Address,
    },
    [SupportedNetworkId.TestnetEvm]: {
        [ExplorerEndpoint.Transaction]: 'tx',
        [ExplorerEndpoint.Address]: ExplorerEndpoint.Address,
    },
}
