import { CoinType } from '@iota/sdk/out/types'
import { NetworkType, NetworkNamespace, ChainId } from '../enums'
import { EvmNetworkId } from '../types'
import { IBaseToken } from '@core/token/interfaces'
import { IExplorerConfig } from '@auxiliary/explorer'

export interface IIscChainConfiguration extends IBaseEvmNetworkConfiguration {
    type: NetworkType.Isc
    aliasAddress: string
    apiEndpoint: string
}

export interface IPureEvmNetworkConfiguration extends IBaseEvmNetworkConfiguration {
    type: NetworkType.Evm
}

export interface IBaseEvmNetworkConfiguration {
    id: EvmNetworkId
    namespace: NetworkNamespace.Evm
    chainId: ChainId
    baseToken: IBaseToken
    type: NetworkType
    coinType: CoinType
    name: string
    explorer?: IExplorerConfig
    blockscoutIndexerUrl?: string
    novesIndexerUrl?: string
    rpcEndpoint: string
    blocksUntilConfirmed: number
}
