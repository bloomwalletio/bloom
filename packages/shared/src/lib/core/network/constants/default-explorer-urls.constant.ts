import { NetworkId } from '../types'
import { SupportedNetworkId } from './supported-network-id.constant'

export const DEFAULT_EXPLORER_URLS: Readonly<{ [key in NetworkId]?: string }> = {
    [SupportedNetworkId.Iota]: 'https://explorer.iota.org/mainnet/',
    [SupportedNetworkId.Shimmer]: 'https://explorer.shimmer.network/shimmer/',
    [SupportedNetworkId.IotaTestnet]: 'https://explorer.iota.org/iota-testnet/',
    [SupportedNetworkId.Testnet]: 'https://explorer.shimmer.network/testnet/',
    [SupportedNetworkId.IotaEvm]: 'https://explorer.evm.iota.org',
    [SupportedNetworkId.ShimmerEvm]: 'https://explorer.evm.shimmer.network',
    [SupportedNetworkId.IotaTestnetEvm]: 'https://explorer.evm.testnet.iota.org',
    [SupportedNetworkId.TestnetEvm]: 'https://explorer.evm.testnet.shimmer.network',
    [SupportedNetworkId.Ethereum]: 'https://eth.blockscout.com',
    [SupportedNetworkId.Sepolia]: 'https://eth-sepolia.blockscout.com',
}
