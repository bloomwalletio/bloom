import { SupportedNetworkId } from '../enums'
import { NetworkId } from '../types'

export const DEFAULT_EXPLORER_URLS: Readonly<{ [key in NetworkId]?: string }> = {
    [SupportedNetworkId.Shimmer]: 'https://explorer.shimmer.network/shimmer',
    [SupportedNetworkId.Testnet]: 'https://explorer.shimmer.network/testnet',
    [SupportedNetworkId.ShimmerEvm]: 'https://explorer.evm.shimmer.network/',
    [SupportedNetworkId.TestnetEvm]: 'https://explorer.evm.testnet.shimmer.network',
}
