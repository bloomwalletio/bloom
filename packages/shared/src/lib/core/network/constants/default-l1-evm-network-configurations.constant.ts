import { ChainId, EvmNetworkType, NetworkNamespace } from '../enums'
import { IPureEvmNetworkConfiguration } from '../interfaces'
import { EvmNetworkId } from '../types'
import { DEFAULT_COIN_TYPE } from './default-coin-type.constant'
import { SupportedL1EvmNetworkId, SupportedNetworkId } from './supported-network-id.constant'
import { DEFAULT_EXPLORER_URLS } from './default-explorer-urls.constant'
import { EVM_BASE_TOKEN } from './default-base-token.constant'

export const DEFAULT_L1_EVM_NETWORK_CONFIGURATION: Readonly<{
    [key in EvmNetworkId]: IPureEvmNetworkConfiguration
}> = {
    [SupportedL1EvmNetworkId.Ethereum]: {
        type: EvmNetworkType.PureEvm,
        name: 'Ethereum',
        baseToken: EVM_BASE_TOKEN,
        id: SupportedL1EvmNetworkId.Ethereum,
        chainId: ChainId.Ethereum,
        namespace: NetworkNamespace.Evm,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Ethereum] ?? 0,
        explorerUrl: DEFAULT_EXPLORER_URLS[SupportedNetworkId.Ethereum],
        rpcEndpoint: 'https://ethereum-rpc.publicnode.com',
    },
    [SupportedL1EvmNetworkId.Sepolia]: {
        type: EvmNetworkType.PureEvm,
        name: 'Sepolia Testnet',
        baseToken: EVM_BASE_TOKEN,
        id: SupportedL1EvmNetworkId.Sepolia,
        chainId: ChainId.Sepolia,
        namespace: NetworkNamespace.Evm,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Sepolia] ?? 0,
        explorerUrl: DEFAULT_EXPLORER_URLS[SupportedNetworkId.Sepolia],
        rpcEndpoint: 'https://ethereum-sepolia-rpc.publicnode.com',
    },
}
