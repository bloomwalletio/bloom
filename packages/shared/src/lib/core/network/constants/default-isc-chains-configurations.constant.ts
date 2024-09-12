import { NetworkType, NetworkNamespace, ChainId } from '../enums'
import { IIscChainConfiguration } from '../interfaces'
import { StardustNetworkId } from '../types'
import { DEFAULT_BASE_TOKEN } from './default-base-token.constant'
import { DEFAULT_BLOCKSCOUT_INDEXER_URLS } from './default-blockscout-indexer-urls.constant'
import { DEFAULT_COIN_TYPE } from './default-coin-type.constant'
import { DEFAULT_EXPLORER_CONFIGS } from './default-explorer-configs.constant'
import { SupportedIscNetworkId, SupportedNetworkId, SupportedStardustNetworkId } from './supported-network-id.constant'
import { isFeatureEnabled } from '@lib/features/utils'

const IOTA_EVM_CHAIN_CONFIGURATION: IIscChainConfiguration = {
    id: SupportedIscNetworkId.IotaEvm,
    type: NetworkType.Isc,
    name: 'IOTA EVM',
    chainId: ChainId.IotaEvm,
    namespace: NetworkNamespace.Evm,
    baseToken: DEFAULT_BASE_TOKEN[SupportedNetworkId.IotaEvm],
    coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.IotaEvm],
    aliasAddress: 'iota1pzt3mstq6khgc3tl0mwuzk3eqddkryqnpdxmk4nr25re2466uxwm28qqxu5',
    rpcEndpoint: 'https://json-rpc.evm.iotaledger.net/',
    apiEndpoint: 'https://api.evm.iotaledger.net/',
    explorer: DEFAULT_EXPLORER_CONFIGS[SupportedNetworkId.IotaEvm],
    blockscoutIndexerUrl: DEFAULT_BLOCKSCOUT_INDEXER_URLS[SupportedNetworkId.IotaEvm],
}

const SHIMMER_EVM_CHAIN_CONFIGURATION: IIscChainConfiguration = {
    id: SupportedIscNetworkId.ShimmerEvm,
    type: NetworkType.Isc,
    name: 'Shimmer EVM',
    chainId: ChainId.ShimmerEvm,
    namespace: NetworkNamespace.Evm,
    baseToken: DEFAULT_BASE_TOKEN[SupportedNetworkId.ShimmerEvm],
    coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.ShimmerEvm] ?? 0,
    aliasAddress: 'smr1prxvwqvwf7nru5q5xvh5thwg54zsm2y4wfnk6yk56hj3exxkg92mx20wl3s',
    rpcEndpoint: 'https://json-rpc.evm.shimmer.network/',
    apiEndpoint: 'https://api.evm.shimmer.network/',
    explorer: DEFAULT_EXPLORER_CONFIGS[SupportedNetworkId.ShimmerEvm],
    blockscoutIndexerUrl: DEFAULT_BLOCKSCOUT_INDEXER_URLS[SupportedNetworkId.ShimmerEvm],
}

const IOTA_TESTNET_EVM_CHAIN_CONFIGURATION: IIscChainConfiguration = {
    id: SupportedIscNetworkId.IotaTestnetEvm,
    type: NetworkType.Isc,
    name: 'IOTA Testnet EVM',
    chainId: ChainId.IotaTestnetEvm,
    namespace: NetworkNamespace.Evm,
    baseToken: DEFAULT_BASE_TOKEN[SupportedNetworkId.IotaTestnetEvm],
    coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.IotaTestnetEvm] ?? 0,
    aliasAddress: 'tst1pzxsrr7apqkdzz633dyntmvxwtyvk029p39te5j0m33q6946h7akzv663zu',
    rpcEndpoint: 'https://json-rpc.evm.testnet.iotaledger.net/',
    apiEndpoint: 'https://api.evm.testnet.iotaledger.net/',
    explorer: DEFAULT_EXPLORER_CONFIGS[SupportedNetworkId.IotaTestnetEvm],
    blockscoutIndexerUrl: DEFAULT_BLOCKSCOUT_INDEXER_URLS[SupportedNetworkId.IotaTestnetEvm],
}

// exported as used in tests
export const TESTNET_EVM_CHAIN_CONFIGURATION: IIscChainConfiguration = {
    id: SupportedIscNetworkId.TestnetEvm,
    type: NetworkType.Isc,
    name: 'Shimmer Testnet EVM',
    chainId: ChainId.TestnetEvm,
    namespace: NetworkNamespace.Evm,
    baseToken: DEFAULT_BASE_TOKEN[SupportedNetworkId.TestnetEvm],
    coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.TestnetEvm] ?? 0,
    aliasAddress: 'rms1ppp00k5mmd2m8my8ukkp58nd3rskw6rx8l09aj35984k74uuc5u2cywn3ex',
    rpcEndpoint: 'https://json-rpc.evm.testnet.shimmer.network/',
    apiEndpoint: 'https://api.evm.testnet.shimmer.network/',
    explorer: DEFAULT_EXPLORER_CONFIGS[SupportedNetworkId.TestnetEvm],
    blockscoutIndexerUrl: DEFAULT_BLOCKSCOUT_INDEXER_URLS[SupportedNetworkId.TestnetEvm],
}

export const DEFAULT_ISC_CHAINS_CONFIGURATIONS: Readonly<{ [id in StardustNetworkId]?: IIscChainConfiguration }> = {
    ...(isFeatureEnabled('onboarding.iota.defaultIscChains') && {
        [SupportedStardustNetworkId.Iota]: IOTA_EVM_CHAIN_CONFIGURATION,
    }),
    ...(isFeatureEnabled('onboarding.shimmer.defaultIscChains') && {
        [SupportedStardustNetworkId.Shimmer]: SHIMMER_EVM_CHAIN_CONFIGURATION,
    }),
    ...(isFeatureEnabled('onboarding.iotaTestnet.defaultIscChains') && {
        [SupportedStardustNetworkId.IotaTestnet]: IOTA_TESTNET_EVM_CHAIN_CONFIGURATION,
    }),
    ...(isFeatureEnabled('onboarding.testnet.defaultIscChains') && {
        [SupportedStardustNetworkId.Testnet]: TESTNET_EVM_CHAIN_CONFIGURATION,
    }),
}
