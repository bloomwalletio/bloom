import { CoinType } from '@iota/sdk/out/types'
import { EvmNetworkType, NetworkNamespace, ChainId } from '../enums'
import { EvmNetworkId } from '../types'
import { IBaseToken } from '@core/token/interfaces'

export interface IIscChainConfiguration extends IBaseEvmNetworkConfiguration {
    type: EvmNetworkType.Isc
    aliasAddress: string
    apiEndpoint: string
}

export interface IPureEvmNetworkConfiguration extends IBaseEvmNetworkConfiguration {
    type: EvmNetworkType.PureEvm
}

export interface IBaseEvmNetworkConfiguration {
    id: EvmNetworkId
    namespace: NetworkNamespace.Evm
    chainId: ChainId
    baseToken: IBaseToken
    type: EvmNetworkType
    coinType: CoinType
    name: string
    explorerUrl?: string
    rpcEndpoint: string
}
