import { isFeatureEnabled } from '@lib/features/utils'
import { ChainId, NetworkNamespace, NetworkType } from '../enums'
import { IPureEvmNetworkConfiguration } from '../interfaces'
import { StardustNetworkId } from '../types'
import { EVM_BASE_TOKEN } from './default-base-token.constant'
import { DEFAULT_COIN_TYPE } from './default-coin-type.constant'
import { DEFAULT_EXPLORER_URLS } from './default-explorer-urls.constant'
import {
    SupportedL1EvmNetworkId,
    SupportedL2EvmNetworkId,
    SupportedNetworkId,
    SupportedStardustNetworkId,
} from './supported-network-id.constant'

// Ethereum Mainnet

const ETHEREUM_NETWORK_CONFIGURATION: IPureEvmNetworkConfiguration = {
    type: NetworkType.Evm,
    name: 'Ethereum',
    baseToken: EVM_BASE_TOKEN,
    id: SupportedL1EvmNetworkId.Ethereum,
    chainId: ChainId.Ethereum,
    namespace: NetworkNamespace.Evm,
    coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Ethereum] ?? 0,
    explorerUrl: DEFAULT_EXPLORER_URLS[SupportedNetworkId.Ethereum],
    rpcEndpoint: 'https://ethereum-rpc.publicnode.com',
}

// Ethereum L2s

export const ARBITRUM_NETWORK_CONFIGURATION: IPureEvmNetworkConfiguration = {
    type: NetworkType.Evm,
    name: 'Arbitrum',
    baseToken: EVM_BASE_TOKEN,
    id: SupportedL2EvmNetworkId.Arbitrum,
    chainId: ChainId.Arbitrum,
    namespace: NetworkNamespace.Evm,
    coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Ethereum] ?? 0,
    explorerUrl: DEFAULT_EXPLORER_URLS[SupportedNetworkId.Arbitrum],
    rpcEndpoint: 'https://arbitrum-one-rpc.publicnode.com',
}

export const BASE_NETWORK_CONFIGURATION: IPureEvmNetworkConfiguration = {
    type: NetworkType.Evm,
    name: 'Base',
    baseToken: EVM_BASE_TOKEN,
    id: SupportedL2EvmNetworkId.Base,
    chainId: ChainId.Base,
    namespace: NetworkNamespace.Evm,
    coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Ethereum] ?? 0,
    explorerUrl: DEFAULT_EXPLORER_URLS[SupportedNetworkId.Base],
    rpcEndpoint: 'https://base-rpc.publicnode.com',
}

export const BLAST_NETWORK_CONFIGURATION: IPureEvmNetworkConfiguration = {
    type: NetworkType.Evm,
    name: 'Blast',
    baseToken: EVM_BASE_TOKEN,
    id: SupportedL2EvmNetworkId.Blast,
    chainId: ChainId.Blast,
    namespace: NetworkNamespace.Evm,
    coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Ethereum] ?? 0,
    explorerUrl: DEFAULT_EXPLORER_URLS[SupportedNetworkId.Blast],
    rpcEndpoint: 'https://blast-rpc.publicnode.com',
}

export const OPTIMISM_NETWORK_CONFIGURATION: IPureEvmNetworkConfiguration = {
    type: NetworkType.Evm,
    name: 'Optimism',
    baseToken: EVM_BASE_TOKEN,
    id: SupportedL2EvmNetworkId.Optimism,
    chainId: ChainId.Optimism,
    namespace: NetworkNamespace.Evm,
    coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Ethereum] ?? 0,
    explorerUrl: DEFAULT_EXPLORER_URLS[SupportedNetworkId.Optimism],
    rpcEndpoint: 'https://optimism-rpc.publicnode.com',
}

export const IMMUTABLE_NETWORK_CONFIGURATION: IPureEvmNetworkConfiguration = {
    type: NetworkType.Evm,
    name: 'Immutable',
    baseToken: EVM_BASE_TOKEN,
    id: SupportedL2EvmNetworkId.Immutable,
    chainId: ChainId.Immutable,
    namespace: NetworkNamespace.Evm,
    coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Ethereum] ?? 0,
    explorerUrl: DEFAULT_EXPLORER_URLS[SupportedNetworkId.Immutable],
    rpcEndpoint: 'https://rpc.immutable.com',
}

// Ethereum Sepolia Testnet

export const SEPOLIA_NETWORK_CONFIGURATION: IPureEvmNetworkConfiguration = {
    type: NetworkType.Evm,
    name: 'Sepolia Testnet',
    baseToken: EVM_BASE_TOKEN,
    id: SupportedL1EvmNetworkId.Sepolia,
    chainId: ChainId.Sepolia,
    namespace: NetworkNamespace.Evm,
    coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Sepolia] ?? 0,
    explorerUrl: DEFAULT_EXPLORER_URLS[SupportedNetworkId.Sepolia],
    rpcEndpoint: 'https://ethereum-sepolia-rpc.publicnode.com',
}

// Ethereum L2 Testnets

export const ARBITRUM_TESTNET_NETWORK_CONFIGURATION: IPureEvmNetworkConfiguration = {
    type: NetworkType.Evm,
    name: 'Arbitrum Sepolia',
    baseToken: EVM_BASE_TOKEN,
    id: SupportedL2EvmNetworkId.ArbitrumSepoliaTestnet,
    chainId: ChainId.ArbitrumSepoliaTestnet,
    namespace: NetworkNamespace.Evm,
    coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Ethereum] ?? 0,
    explorerUrl: DEFAULT_EXPLORER_URLS[SupportedNetworkId.ArbitrumSepoliaTestnet],
    rpcEndpoint: 'https://sepolia-rollup.arbitrum.io/rpc',
}

export const BASE_TESTNET_NETWORK_CONFIGURATION: IPureEvmNetworkConfiguration = {
    type: NetworkType.Evm,
    name: 'Base Sepolia',
    baseToken: EVM_BASE_TOKEN,
    id: SupportedL2EvmNetworkId.BaseSepoliaTestnet,
    chainId: ChainId.BaseSepoliaTestnet,
    namespace: NetworkNamespace.Evm,
    coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Ethereum] ?? 0,
    explorerUrl: DEFAULT_EXPLORER_URLS[SupportedNetworkId.BaseSepoliaTestnet],
    rpcEndpoint: 'https://sepolia.base.org',
}

export const BLAST_TESTNET_NETWORK_CONFIGURATION: IPureEvmNetworkConfiguration = {
    type: NetworkType.Evm,
    name: 'Blast Sepolia',
    baseToken: EVM_BASE_TOKEN,
    id: SupportedL2EvmNetworkId.BlastSepoliaTestnet,
    chainId: ChainId.BlastSepoliaTestnet,
    namespace: NetworkNamespace.Evm,
    coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Ethereum] ?? 0,
    explorerUrl: DEFAULT_EXPLORER_URLS[SupportedNetworkId.BlastSepoliaTestnet],
    rpcEndpoint: 'https://sepolia.blast.io',
}

export const OPTIMISM_TESTNET_NETWORK_CONFIGURATION: IPureEvmNetworkConfiguration = {
    type: NetworkType.Evm,
    name: 'Optimism Sepolia',
    baseToken: EVM_BASE_TOKEN,
    id: SupportedL2EvmNetworkId.OptimismSepoliaTestnet,
    chainId: ChainId.OptimismSepoliaTestnet,
    namespace: NetworkNamespace.Evm,
    coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Ethereum] ?? 0,
    explorerUrl: DEFAULT_EXPLORER_URLS[SupportedNetworkId.Optimism],
    rpcEndpoint: 'https://sepolia.optimism.io',
}

export const IMMUTABLE_TESTNET_NETWORK_CONFIGURATION: IPureEvmNetworkConfiguration = {
    type: NetworkType.Evm,
    name: 'Immutable Testnet',
    baseToken: EVM_BASE_TOKEN,
    id: SupportedL2EvmNetworkId.ImmutableTestnet,
    chainId: ChainId.ImmutableTestnet,
    namespace: NetworkNamespace.Evm,
    coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Ethereum] ?? 0,
    explorerUrl: DEFAULT_EXPLORER_URLS[SupportedNetworkId.ImmutableTestnet],
    rpcEndpoint: 'https://rpc.testnet.immutable.com',
}

export const KNOWN_EVM_NETWORKS_CONFIGURATIONS: Readonly<IPureEvmNetworkConfiguration[]> = [
    ETHEREUM_NETWORK_CONFIGURATION,
    ARBITRUM_NETWORK_CONFIGURATION,
    BASE_NETWORK_CONFIGURATION,
    BLAST_NETWORK_CONFIGURATION,
    OPTIMISM_NETWORK_CONFIGURATION,
    IMMUTABLE_NETWORK_CONFIGURATION,
]

export const KNOWN_EVM_TESTNET_NETWORKS_CONFIGURATIONS: Readonly<IPureEvmNetworkConfiguration[]> = [
    SEPOLIA_NETWORK_CONFIGURATION,
    ARBITRUM_TESTNET_NETWORK_CONFIGURATION,
    BASE_TESTNET_NETWORK_CONFIGURATION,
    BLAST_TESTNET_NETWORK_CONFIGURATION,
    OPTIMISM_TESTNET_NETWORK_CONFIGURATION,
    IMMUTABLE_TESTNET_NETWORK_CONFIGURATION,
]

export const DEFAULT_EVM_NETWORK_CONFIGURATIONS_FOR_STARDUST_NETWORK: Readonly<{
    [key in StardustNetworkId]: IPureEvmNetworkConfiguration[]
}> = {
    ...(isFeatureEnabled('onboarding.iota.defaultEvmChains') && {
        [SupportedStardustNetworkId.Iota]: [ETHEREUM_NETWORK_CONFIGURATION],
    }),
    ...(isFeatureEnabled('onboarding.shimmer.defaultEvmChains') && {
        [SupportedStardustNetworkId.Shimmer]: [ETHEREUM_NETWORK_CONFIGURATION],
    }),
    ...(isFeatureEnabled('onboarding.iotaTestnet.defaultEvmChains') && {
        [SupportedStardustNetworkId.IotaTestnet]: [SEPOLIA_NETWORK_CONFIGURATION],
    }),
    ...(isFeatureEnabled('onboarding.testnet.defaultEvmChains') && {
        [SupportedStardustNetworkId.Testnet]: [SEPOLIA_NETWORK_CONFIGURATION],
    }),
}
