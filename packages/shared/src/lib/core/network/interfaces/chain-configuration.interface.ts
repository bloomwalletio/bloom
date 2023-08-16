import { ChainType, EvmChainId, NetworkNamespace } from '../enums'
import { NetworkId } from '../types'

export interface IIscpChainConfiguration extends IBaseChainConfiguration {
    type: ChainType.Iscp
    aliasAddress: string
    iscpEndpoint: string
}

export interface IEvmChainConfiguration extends IBaseChainConfiguration {
    type: ChainType.Evm
    rpcEndpoint: string
    symbol: string
    ticker: string
}

export interface IBaseChainConfiguration {
    id: NetworkId
    type: ChainType
    chainId: EvmChainId | number
    namespace: NetworkNamespace.Evm
    coinType: number
    name: string
    explorerUrl?: string
}
