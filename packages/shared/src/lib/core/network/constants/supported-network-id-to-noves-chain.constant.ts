import { NetworkId } from '../types'
import { SupportedNetworkId } from './supported-network-id.constant'

export const SUPPORTED_NETWORK_ID_TO_NOVES_CHAIN: Readonly<{ [key in NetworkId]?: string }> = {
    [SupportedNetworkId.ShimmerEvm]: 'shimmer-evm',
    [SupportedNetworkId.Ethereum]: 'eth',
    [SupportedNetworkId.Sepolia]: 'eth-sepolia',
    [SupportedNetworkId.Arbitrum]: 'arbitrum',
    [SupportedNetworkId.Base]: 'base',
    [SupportedNetworkId.Blast]: 'blast',
    [SupportedNetworkId.Optimism]: 'optimism',
    [SupportedNetworkId.Bnb]: 'bsc',
}
