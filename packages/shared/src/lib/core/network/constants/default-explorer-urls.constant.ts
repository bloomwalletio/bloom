import { NetworkId } from '../types'
import { SupportedNetworkId } from './supported-network-id.constant'

export const DEFAULT_EXPLORER_URLS: Readonly<{ [key in NetworkId]?: string }> = {
    [SupportedNetworkId.Iota]: 'https://explorer.iota.org',
    [SupportedNetworkId.Shimmer]: 'https://explorer.shimmer.network',
    [SupportedNetworkId.Testnet]: 'https://explorer.shimmer.network',
    [SupportedNetworkId.IotaEvm]:
        'https://github.com/bloomwalletio/bloom-private/pull/17/files#diff-4307059d77fecb4adb7f81099c9404995ef9f4a617496ee0e1fb7cb0eb46c0ae',
    [SupportedNetworkId.Ethereum]: 'https://eth.blockscout.com',
    [SupportedNetworkId.ShimmerEvm]: 'https://explorer.evm.shimmer.network',
    [SupportedNetworkId.TestnetEvm]: 'https://explorer.evm.testnet.shimmer.network',
    [SupportedNetworkId.Sepolia]: 'https://eth-sepolia.blockscout.com',
}
