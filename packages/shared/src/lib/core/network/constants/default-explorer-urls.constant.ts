import { NetworkId } from '../types'
import { SupportedNetworkId } from './supported-network-id.constant'

export const DEFAULT_EXPLORER_URLS: Readonly<{ [key in NetworkId]?: string }> = {
    // IOTA
    [SupportedNetworkId.Iota]: 'https://explorer.iota.org/mainnet/',
    [SupportedNetworkId.IotaEvm]: 'https://explorer.evm.iota.org',
    [SupportedNetworkId.IotaTestnet]: 'https://explorer.iota.org/iota-testnet/',
    [SupportedNetworkId.IotaTestnetEvm]: 'https://explorer.evm.testnet.iotaledger.net',

    // Shimmer
    [SupportedNetworkId.Shimmer]: 'https://explorer.shimmer.network/shimmer/',
    [SupportedNetworkId.ShimmerEvm]: 'https://explorer.evm.shimmer.network',
    [SupportedNetworkId.Testnet]: 'https://explorer.shimmer.network/testnet/',
    [SupportedNetworkId.TestnetEvm]: 'https://explorer.evm.testnet.shimmer.network',

    // Ethereum
    [SupportedNetworkId.Ethereum]: 'https://eth.blockscout.com',
    [SupportedNetworkId.Sepolia]: 'https://eth-sepolia.blockscout.com',

    // Arbitrum
    [SupportedNetworkId.Arbitrum]: 'https://arbitrum.blockscout.com',

    // Base
    [SupportedNetworkId.Base]: 'https://base.blockscout.com',

    // Blast
    [SupportedNetworkId.Blast]: 'https://blast.blockscout.com',

    // Immutable
    [SupportedNetworkId.Immutable]: 'https://explorer.immutable.com',

    // Optimism
    [SupportedNetworkId.Optimism]: 'https://optimism.blockscout.com',
}
