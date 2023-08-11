import { SupportedNetworkId } from '../enums'
import { NetworkIdType } from '../types'

export const EXPLORER_URLS: Readonly<{ [key in NetworkIdType]?: string }> = {
    [SupportedNetworkId.Iota]: 'https://explorer.iota.org/mainnet',
    [SupportedNetworkId.Shimmer]: 'https://explorer.shimmer.network/shimmer',
    [SupportedNetworkId.Testnet]: 'https://explorer.shimmer.network/testnet',
    [SupportedNetworkId.ShimmerEvm]: '',
    [SupportedNetworkId.ShimmerEvmTestnet]: 'https://explorer.evm.testnet.shimmer.network/',
}
