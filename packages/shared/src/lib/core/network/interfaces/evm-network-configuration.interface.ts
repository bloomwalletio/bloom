import { CoinType } from '@iota/sdk/out/types'
import { EvmNetworkType, NetworkNamespace, ChainId } from '../enums'
import { EvmNetworkId } from '../types'

export interface IIscpEvmNetworkConfiguration extends IBaseEvmNetworkConfiguration {
    type: EvmNetworkType.Iscp
    aliasAddress: string
    apiEndpoint: string
}

export interface IPureEvmNetworkConfiguration extends IBaseEvmNetworkConfiguration {
    type: EvmNetworkType.PureEvm
    symbol: string
    ticker: string
}

interface IBaseEvmNetworkConfiguration {
    id: EvmNetworkId
    namespace: NetworkNamespace.Evm
    chainId: ChainId
    type: EvmNetworkType
    coinType: CoinType
    name: string
    explorerUrl?: string
    rpcEndpoint: string
}