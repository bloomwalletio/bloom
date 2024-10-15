import { NetworkId } from '../../../core/network/types'
import { SupportedNetworkId } from '../../../core/network/constants/supported-network-id.constant'
import { SupportedNovesChain } from '../enums'

export const SUPPORTED_NETWORK_ID_TO_NOVES_CHAIN: Readonly<{ [key in NetworkId]?: string }> = {
    [SupportedNetworkId.ShimmerEvm]: SupportedNovesChain.ShimmerEvm,
    [SupportedNetworkId.Ethereum]: SupportedNovesChain.Ethereum,
    [SupportedNetworkId.Sepolia]: SupportedNovesChain.Sepolia,
    [SupportedNetworkId.Arbitrum]: SupportedNovesChain.Arbitrum,
    [SupportedNetworkId.Base]: SupportedNovesChain.Base,
    [SupportedNetworkId.Blast]: SupportedNovesChain.Blast,
    [SupportedNetworkId.Optimism]: SupportedNovesChain.Optimism,
    [SupportedNetworkId.Bnb]: SupportedNovesChain.Bnb,
}
