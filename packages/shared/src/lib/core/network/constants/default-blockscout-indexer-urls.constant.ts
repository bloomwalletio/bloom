import { NetworkId } from '../types'
import { SupportedNetworkId } from './supported-network-id.constant'

export const DEFAULT_BLOCKSCOUT_INDEXER_URLS: Readonly<{ [key in NetworkId]?: string }> = {
    // IOTA
    [SupportedNetworkId.IotaEvm]: 'https://explorer.evm.iota.org',
    [SupportedNetworkId.IotaTestnetEvm]: 'https://explorer.evm.testnet.iotaledger.net',

    // Shimmer
    [SupportedNetworkId.ShimmerEvm]: 'https://explorer.evm.shimmer.network',
    [SupportedNetworkId.TestnetEvm]: 'https://explorer.evm.testnet.shimmer.network',

    // Ethereum
    [SupportedNetworkId.Ethereum]: 'https://eth.blockscout.com',
    [SupportedNetworkId.Sepolia]: 'https://eth-sepolia.blockscout.com',

    // Arbitrum
    [SupportedNetworkId.Arbitrum]: 'https://arbitrum.blockscout.com',
    [SupportedNetworkId.ArbitrumGoerli]: 'https://arbitrum-sepolia.blockscout.com',

    // Base
    [SupportedNetworkId.Base]: 'https://base.blockscout.com',
    [SupportedNetworkId.BaseSepoliaTestnet]: 'https://base-sepolia.blockscout.com',

    // Blast
    [SupportedNetworkId.Blast]: 'https://blast.blockscout.com',
    [SupportedNetworkId.BlastSepoliaTestnet]: 'https://blast-testnet.blockscout.com',

    // Immutable
    [SupportedNetworkId.Immutable]: 'https://explorer.immutable.com',
    [SupportedNetworkId.ImmutableTestnet]: 'https://explorer.testnet.immutable.com',

    // Optimism
    [SupportedNetworkId.Optimism]: 'https://optimism.blockscout.com',
    [SupportedNetworkId.OptimismSepoliaTestnet]: 'https://optimism-sepolia.blockscout.com',
}
