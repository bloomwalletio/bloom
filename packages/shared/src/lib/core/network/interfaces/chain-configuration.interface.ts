import { CoinType } from '@iota/sdk/out/types'
import { ChainType, EvmChainId, NetworkNamespace } from '../enums'
import { NetworkId } from '../types'

export interface IIscpChainConfiguration extends IBaseChainConfiguration {
    type: ChainType.Iscp
    aliasAddress: string
    apiEndpoint: string
}

export interface IEvmChainConfiguration extends IBaseChainConfiguration {
    type: ChainType.Evm
    symbol: string
    ticker: string
}

export interface IBaseChainConfiguration {
    id: NetworkId
    namespace: NetworkNamespace.Evm
    chainId: EvmChainId
    type: ChainType
    coinType: CoinType
    name: string
    explorerUrl?: string
    rpcEndpoint: string
}
