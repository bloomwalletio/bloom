import { SupportedNetworkId } from '../enums'

export const DEFAULT_EXPLORER_URLS: Readonly<{ [key in SupportedNetworkId]: string }> = {
    [SupportedNetworkId.Iota]: 'https://explorer.iota.org',
    [SupportedNetworkId.Shimmer]: 'https://explorer.shimmer.network',
    [SupportedNetworkId.Testnet]: 'https://explorer.shimmer.network',
    [SupportedNetworkId.IotaEvm]: 'https://explorer.evm.shimmer.network',
    [SupportedNetworkId.ShimmerEvm]: 'https://explorer.evm.shimmer.network',
    [SupportedNetworkId.TestnetEvm]: 'https://explorer.evm.testnet.shimmer.network',
}
