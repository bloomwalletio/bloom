import { NetworkId } from '../types'
import { SupportedNetworkId } from './supported-network-id.constant'

export const DEFAULT_EXPLORER_URLS: Readonly<{ [key in NetworkId]?: string }> = {
    [SupportedNetworkId.Iota]: 'https://explorer.iota.org',
    [SupportedNetworkId.Shimmer]: 'https://explorer.shimmer.network',
    [SupportedNetworkId.IotaTestnet]: 'https://explorer.iota.org',
    [SupportedNetworkId.Testnet]: 'https://explorer.shimmer.network',
    [SupportedNetworkId.IotaEvm]: 'https://explorer.evm.iota.org',
    [SupportedNetworkId.ShimmerEvm]: 'https://explorer.evm.shimmer.network',
    [SupportedNetworkId.IotaTestnetEvm]: 'https://explorer.evm.testnet.iota.org',
    [SupportedNetworkId.TestnetEvm]: 'https://explorer.evm.testnet.shimmer.network',
    [SupportedNetworkId.Ethereum]: 'https://eth.blockscout.com',
    [SupportedNetworkId.Sepolia]: 'https://eth-sepolia.blockscout.com',
}
