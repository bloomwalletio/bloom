import { NetworkId } from '../types'
import { SupportedNetworkId } from './supported-network-id.constant'

export const DEFAULT_EXPLORER_URLS: Readonly<{ [key in NetworkId]?: string }> = {
    [SupportedNetworkId.Iota]: 'https://explorer.iota.org',
    [SupportedNetworkId.Shimmer]: 'https://explorer.shimmer.network',
    [SupportedNetworkId.Testnet]: 'https://explorer.shimmer.network',
    [SupportedNetworkId.Ethereum]: 'https://eth.blockscout.com',
    [SupportedNetworkId.ShimmerEvm]: 'https://explorer.evm.shimmer.network',
    [SupportedNetworkId.TestnetEvm]: 'https://explorer.evm.testnet.shimmer.network',
    [SupportedNetworkId.Sepolia]: 'https://eth-sepolia.blockscout.com',
}
