import { ExplorerEndpoint, SupportedNetworkId } from '../enums'

export const EXPLORER_ENDPOINTS: Readonly<{ [key in SupportedNetworkId]: { [key in ExplorerEndpoint]?: string } }> = {
    [SupportedNetworkId.Iota]: {
        [ExplorerEndpoint.Transaction]: `mainnet/${ExplorerEndpoint.Transaction}`,
        [ExplorerEndpoint.Output]: `mainnet/${ExplorerEndpoint.Output}`,
        [ExplorerEndpoint.Nft]: `mainnet/${ExplorerEndpoint.Nft}`,
        [ExplorerEndpoint.Foundry]: `mainnet/${ExplorerEndpoint.Foundry}`,
        [ExplorerEndpoint.Address]: 'mainnet/addr',
    },
    [SupportedNetworkId.Shimmer]: {
        [ExplorerEndpoint.Transaction]: `shimmer/${ExplorerEndpoint.Transaction}`,
        [ExplorerEndpoint.Output]: `shimmer/${ExplorerEndpoint.Output}`,
        [ExplorerEndpoint.Nft]: `shimmer/${ExplorerEndpoint.Nft}`,
        [ExplorerEndpoint.Foundry]: `shimmer/${ExplorerEndpoint.Foundry}`,
        [ExplorerEndpoint.Address]: 'shimmer/addr',
    },
    [SupportedNetworkId.Testnet]: {
        [ExplorerEndpoint.Transaction]: `testnet/${ExplorerEndpoint.Transaction}`,
        [ExplorerEndpoint.Output]: `testnet/${ExplorerEndpoint.Output}`,
        [ExplorerEndpoint.Nft]: `testnet/${ExplorerEndpoint.Nft}`,
        [ExplorerEndpoint.Foundry]: `testnet/${ExplorerEndpoint.Foundry}`,
        [ExplorerEndpoint.Address]: 'testnet/addr',
    },
    [SupportedNetworkId.IotaEvm]: {
        [ExplorerEndpoint.Transaction]: 'tx',
        [ExplorerEndpoint.Token]: ExplorerEndpoint.Token,
        [ExplorerEndpoint.Address]: ExplorerEndpoint.Address,
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
