import { buildUrl } from '@core/utils'
import { NetworkId } from '../types'
import { SupportedNetworkId } from './supported-network-id.constant'
import { NOVES_TRANSLATE_API_URL } from './noves-translate-api-url.constant'

export const DEFAULT_NOVES_INDEXER_URLS: Readonly<{ [key in NetworkId]?: string }> = {
    // IOTA
    [SupportedNetworkId.IotaEvm]: '',
    [SupportedNetworkId.IotaTestnetEvm]: '',

    // Shimmer
    [SupportedNetworkId.ShimmerEvm]: getEvmIndexerUrl('shimmer-evm'),
    [SupportedNetworkId.TestnetEvm]: '',

    // Ethereum
    [SupportedNetworkId.Ethereum]: getEvmIndexerUrl('eth'),
    [SupportedNetworkId.Sepolia]: getEvmIndexerUrl('eth-sepolia'),

    // Arbitrum
    [SupportedNetworkId.Arbitrum]: getEvmIndexerUrl('arbitrum'),
    [SupportedNetworkId.ArbitrumSepoliaTestnet]: '',

    // Base
    [SupportedNetworkId.Base]: getEvmIndexerUrl('base'),
    [SupportedNetworkId.BaseSepoliaTestnet]: '',

    // Blast
    [SupportedNetworkId.Blast]: getEvmIndexerUrl('blast'),
    [SupportedNetworkId.BlastSepoliaTestnet]: '',

    // Immutable
    [SupportedNetworkId.Immutable]: '',
    [SupportedNetworkId.ImmutableTestnet]: '',

    // Optimism
    [SupportedNetworkId.Optimism]: getEvmIndexerUrl('optimism'),
    [SupportedNetworkId.OptimismSepoliaTestnet]: '',

    // BNB Smart Chain
    [SupportedNetworkId.Bnb]: getEvmIndexerUrl('bsc'),
    [SupportedNetworkId.BnbTestnet]: '',
}

function getEvmIndexerUrl(networkName: string): string | undefined {
    return buildUrl({ base: NOVES_TRANSLATE_API_URL, pathname: `evm/${networkName}` })?.toString()
}
