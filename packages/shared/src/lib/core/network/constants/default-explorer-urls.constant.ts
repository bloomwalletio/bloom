import { SupportedNetworkId } from '../enums'

export const DEFAULT_EXPLORER_URLS: Readonly<{ [key in SupportedNetworkId]?: string }> = {
    [SupportedNetworkId.Iota]: 'https://explorer.iota.org/mainnet',
    [SupportedNetworkId.Shimmer]: 'https://explorer.shimmer.network/shimmer',
    [SupportedNetworkId.Testnet]: 'https://explorer.shimmer.network/testnet',
    [SupportedNetworkId.ShimmerEvm]: 'https://explorer.evm.shimmer.network',
    [SupportedNetworkId.TestnetEvm]: 'https://explorer.evm.testnet.shimmer.network',
}
