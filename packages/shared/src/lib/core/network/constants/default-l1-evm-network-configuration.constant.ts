import { ChainId } from '../enums'
import { IPureEvmNetworkConfiguration } from '../interfaces'
import { EvmNetworkId } from '../types'
import { DEFAULT_COIN_TYPE } from './default-coin-type.constant'
import { SupportedNetworkId } from './supported-network-id.constant'
import { DEFAULT_EXPLORER_URLS } from '@core/network/constants/default-explorer-urls.constant'

export const DEFAULT_L1_EVM_NETWORK_CONFIGURATION: Readonly<{
    [key in EvmNetworkId]: IPureEvmNetworkConfiguration
}> = {
    [SupportedNetworkId.Ethereum]: <IPureEvmNetworkConfiguration>{
        name: 'Ethereum',
        symbol: 'ETH',
        ticker: 'ETH',
        id: SupportedNetworkId.Ethereum,
        chainId: ChainId.Ethereum,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Ethereum],
        explorerUrl: DEFAULT_EXPLORER_URLS[SupportedNetworkId.Ethereum],
        rpcEndpoint: 'https://ethereum-rpc.publicnode.com',
    },
    [SupportedNetworkId.Sepolia]: <IPureEvmNetworkConfiguration>{
        name: 'Sepolia Testnet',
        symbol: 'ETH',
        ticker: 'ETH',
        id: SupportedNetworkId.Sepolia,
        chainId: ChainId.Sepolia,
        coinType: DEFAULT_COIN_TYPE[SupportedNetworkId.Sepolia],
        explorerUrl: DEFAULT_EXPLORER_URLS[SupportedNetworkId.Sepolia],
        rpcEndpoint: 'https://ethereum-sepolia-rpc.publicnode.com',
    },
}
