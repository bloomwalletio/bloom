import { StardustNetworkId } from '../types'
import { SupportedNetworkId } from './supported-network-id.constant'

export const DEFAULT_NODE_URLS: Readonly<{ [id in StardustNetworkId]?: string[] }> = {
    [SupportedNetworkId.Iota]: ['https://api.stardust-mainnet.iotaledger.net', 'https://iota-node.tanglebay.com'],
    [SupportedNetworkId.Shimmer]: ['https://api.shimmer.network', 'https://shimmer-node.tanglebay.com'],
    [SupportedNetworkId.IotaTestnet]: ['https://api.testnet.iotaledger.net'],
    [SupportedNetworkId.Testnet]: ['https://api.testnet.shimmer.network'],
}
