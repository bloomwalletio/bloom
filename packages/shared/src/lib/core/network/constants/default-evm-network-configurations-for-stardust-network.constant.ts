import { isFeatureEnabled } from '@lib/features/utils'
import { ChainId, NetworkNamespace, NetworkType } from '../enums'
import { IPureEvmNetworkConfiguration } from '../interfaces'
import { StardustNetworkId } from '../types'
import { EVM_BASE_TOKEN } from './default-base-token.constant'
import { DEFAULT_COIN_TYPE } from './default-coin-type.constant'
import { DEFAULT_EXPLORER_URLS } from './default-explorer-urls.constant'
import {
    SupportedL1EvmNetworkId,
    SupportedNetworkId,
    SupportedStardustNetworkId,
} from './supported-network-id.constant'

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

export const DEFAULT_EVM_NETWORK_CONFIGURATIONS_FOR_STARDUST_NETWORK: Readonly<{
    [key in StardustNetworkId]: IPureEvmNetworkConfiguration[]
}> = {
    ...(isFeatureEnabled('onboarding.iota.defaultEvmChains') && {
        [SupportedStardustNetworkId.Iota]: [ETHEREUM_NETWORK_CONFIGURATION],
    }),
    ...(isFeatureEnabled('onboarding.shimmer.defaultEvmChains') && {
        [SupportedStardustNetworkId.Shimmer]: [ETHEREUM_NETWORK_CONFIGURATION],
    }),
    ...(isFeatureEnabled('onboarding.testnet.defaultEvmChains') && {
        [SupportedStardustNetworkId.Testnet]: [SEPOLIA_NETWORK_CONFIGURATION],
    }),
}
