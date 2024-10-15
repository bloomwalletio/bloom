import { NetworkId } from '../types'
import { SupportedNetworkId } from './supported-network-id.constant'
import { NOVES_TRANSLATE_API_URL } from './noves-translate-api-url.constant'
import { SupportedNovesChain } from '@auxiliary/noves/enums'

export const DEFAULT_NOVES_INDEXER_URLS: Readonly<{ [key in NetworkId]?: string }> = {
    // IOTA
    [SupportedNetworkId.IotaEvm]: '',
    [SupportedNetworkId.IotaTestnetEvm]: '',

    // Shimmer
    [SupportedNetworkId.ShimmerEvm]: getEvmIndexerUrl(SupportedNovesChain.ShimmerEvm),
    [SupportedNetworkId.TestnetEvm]: '',

    // Ethereum
    [SupportedNetworkId.Ethereum]: getEvmIndexerUrl(SupportedNovesChain.Ethereum),
    [SupportedNetworkId.Sepolia]: getEvmIndexerUrl(SupportedNovesChain.Sepolia),

    // Arbitrum
    [SupportedNetworkId.Arbitrum]: getEvmIndexerUrl(SupportedNovesChain.Arbitrum),
    [SupportedNetworkId.ArbitrumSepoliaTestnet]: '',

    // Base
    [SupportedNetworkId.Base]: getEvmIndexerUrl(SupportedNovesChain.Base),
    [SupportedNetworkId.BaseSepoliaTestnet]: '',

    // Blast
    [SupportedNetworkId.Blast]: getEvmIndexerUrl(SupportedNovesChain.Blast),
    [SupportedNetworkId.BlastSepoliaTestnet]: '',

    // Immutable
    [SupportedNetworkId.Immutable]: '',
    [SupportedNetworkId.ImmutableTestnet]: '',

    // Optimism
    [SupportedNetworkId.Optimism]: getEvmIndexerUrl(SupportedNovesChain.Optimism),
    [SupportedNetworkId.OptimismSepoliaTestnet]: '',

    // BNB Smart Chain
    [SupportedNetworkId.Bnb]: getEvmIndexerUrl(SupportedNovesChain.Bnb),
    [SupportedNetworkId.BnbTestnet]: '',
}

function getEvmIndexerUrl(networkName: string): string | undefined {
    return new URL(`evm/${networkName}`, NOVES_TRANSLATE_API_URL).toString()
}
