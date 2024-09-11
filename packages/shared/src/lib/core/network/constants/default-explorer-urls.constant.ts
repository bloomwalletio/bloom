import { ExplorerType, IExplorerConfig } from '@auxiliary/explorer'
import { NetworkId } from '../types'
import { SupportedNetworkId } from './supported-network-id.constant'

export const DEFAULT_EXPLORER_CONFIGS: Readonly<{ [key in NetworkId]?: IExplorerConfig }> = {
    // IOTA
    [SupportedNetworkId.Iota]: {
        type: ExplorerType.Stardust,
        url: 'https://explorer.iota.org/mainnet/',
    },
    [SupportedNetworkId.IotaTestnet]: {
        type: ExplorerType.Stardust,
        url: 'https://explorer.iota.org/iota-testnet/',
    },

    // IOTA EVM
    [SupportedNetworkId.IotaEvm]: {
        type: ExplorerType.Blockscout,
        url: 'https://explorer.evm.iota.org',
    },
    [SupportedNetworkId.IotaTestnetEvm]: {
        type: ExplorerType.Blockscout,
        url: 'https://explorer.evm.testnet.iotaledger.net',
    },

    // Shimmer
    [SupportedNetworkId.Shimmer]: {
        type: ExplorerType.Stardust,
        url: 'https://explorer.shimmer.network/shimmer/',
    },
    [SupportedNetworkId.Testnet]: {
        type: ExplorerType.Stardust,
        url: 'https://explorer.shimmer.network/testnet/',
    },

    // Shimmer EVM
    [SupportedNetworkId.ShimmerEvm]: {
        type: ExplorerType.Blockscout,
        url: 'https://explorer.evm.shimmer.network',
    },
    [SupportedNetworkId.TestnetEvm]: {
        type: ExplorerType.Blockscout,
        url: 'https://explorer.evm.testnet.shimmer.network',
    },

    // Ethereum
    [SupportedNetworkId.Ethereum]: {
        type: ExplorerType.Blockscout,
        url: 'https://eth.blockscout.com',
    },
    [SupportedNetworkId.Sepolia]: {
        type: ExplorerType.Blockscout,
        url: 'https://eth-sepolia.blockscout.com',
    },

    // Arbitrum
    [SupportedNetworkId.Arbitrum]: {
        type: ExplorerType.Blockscout,
        url: 'https://arbitrum.blockscout.com',
    },
    [SupportedNetworkId.ArbitrumSepoliaTestnet]: {
        type: ExplorerType.Blockscout,
        url: 'https://arbitrum-sepolia.blockscout.com',
    },

    // Base
    [SupportedNetworkId.Base]: {
        type: ExplorerType.Blockscout,
        url: 'https://base.blockscout.com',
    },
    [SupportedNetworkId.BaseSepoliaTestnet]: {
        type: ExplorerType.Blockscout,
        url: 'https://base-sepolia.blockscout.com',
    },

    // Blast
    [SupportedNetworkId.Blast]: {
        type: ExplorerType.Blockscout,
        url: 'https://blast.blockscout.com',
    },
    [SupportedNetworkId.BlastSepoliaTestnet]: {
        type: ExplorerType.Blockscout,
        url: 'https://blast-testnet.blockscout.com',
    },

    // Immutable
    [SupportedNetworkId.Immutable]: {
        type: ExplorerType.Blockscout,
        url: 'https://explorer.immutable.com',
    },
    [SupportedNetworkId.ImmutableTestnet]: {
        type: ExplorerType.Blockscout,
        url: 'https://explorer.testnet.immutable.com',
    },

    // Optimism
    [SupportedNetworkId.Optimism]: {
        type: ExplorerType.Blockscout,
        url: 'https://optimism.blockscout.com',
    },
    [SupportedNetworkId.OptimismSepoliaTestnet]: {
        type: ExplorerType.Blockscout,
        url: 'https://optimism-sepolia.blockscout.com',
    },
}
