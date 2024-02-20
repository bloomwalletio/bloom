import { ExplorerEndpoint, SupportedNetworkId } from '../enums'

export const EXPLORER_ENDPOINTS: Readonly<{ [key in SupportedNetworkId]: { [key in ExplorerEndpoint]?: string } }> = {
    [SupportedNetworkId.Iota]: {
        [ExplorerEndpoint.Transaction]: ExplorerEndpoint.Transaction,
        [ExplorerEndpoint.Output]: ExplorerEndpoint.Output,
        [ExplorerEndpoint.Nft]: ExplorerEndpoint.Nft,
        [ExplorerEndpoint.Address]: 'addr',
    },
    [SupportedNetworkId.Shimmer]: {
        [ExplorerEndpoint.Transaction]: ExplorerEndpoint.Transaction,
        [ExplorerEndpoint.Output]: ExplorerEndpoint.Output,
        [ExplorerEndpoint.Nft]: ExplorerEndpoint.Nft,
        [ExplorerEndpoint.Address]: 'addr',
    },
    [SupportedNetworkId.Testnet]: {
        [ExplorerEndpoint.Transaction]: ExplorerEndpoint.Transaction,
        [ExplorerEndpoint.Output]: ExplorerEndpoint.Output,
        [ExplorerEndpoint.Nft]: ExplorerEndpoint.Nft,
        [ExplorerEndpoint.Address]: 'addr',
    },
    [SupportedNetworkId.ShimmerEvm]: {
        [ExplorerEndpoint.Transaction]: 'tx',
        [ExplorerEndpoint.Token]: ExplorerEndpoint.Token,
        [ExplorerEndpoint.Address]: ExplorerEndpoint.Address,
    },
    [SupportedNetworkId.TestnetEvm]: {
        [ExplorerEndpoint.Transaction]: 'tx',
        [ExplorerEndpoint.Token]: ExplorerEndpoint.Token,
        [ExplorerEndpoint.Address]: ExplorerEndpoint.Address,
    },
}
