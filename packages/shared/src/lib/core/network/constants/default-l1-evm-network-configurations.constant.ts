import { ChainId, EvmNetworkType, NetworkNamespace } from '../enums'
import { IPureEvmNetworkConfiguration } from '../interfaces'
import { EvmNetworkId } from '../types'
import { DEFAULT_COIN_TYPE } from './default-coin-type.constant'
import { SupportedNetworkId } from './supported-network-id.constant'
import { DEFAULT_EXPLORER_URLS } from './default-explorer-urls.constant'

export const DEFAULT_L1_EVM_NETWORK_CONFIGURATION: Readonly<{
    [key in EvmNetworkId]: IPureEvmNetworkConfiguration
}> = {
    [SupportedNetworkId.Ethereum as EvmNetworkId]: {
        type: EvmNetworkType.PureEvm,
        name: 'Ethereum',
        symbol: 'ETH',
        ticker: 'ETH',
        id: SupportedNetworkId.Ethereum as EvmNetworkId,
        chainId: ChainId.Ethereum,
        namespace: NetworkNamespace.Evm,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Ethereum] ?? 0,
        explorerUrl: DEFAULT_EXPLORER_URLS[SupportedNetworkId.Ethereum],
        rpcEndpoint: 'https://ethereum-rpc.publicnode.com',
    },
    [SupportedNetworkId.Sepolia as EvmNetworkId]: {
        type: EvmNetworkType.PureEvm,
        name: 'Sepolia Testnet',
        symbol: 'ETH',
        ticker: 'ETH',
        id: SupportedNetworkId.Sepolia as EvmNetworkId,
        chainId: ChainId.Sepolia,
        namespace: NetworkNamespace.Evm,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Sepolia] ?? 0,
        explorerUrl: DEFAULT_EXPLORER_URLS[SupportedNetworkId.Sepolia],
        rpcEndpoint: 'https://ethereum-sepolia-rpc.publicnode.com',
    },
}
