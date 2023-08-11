import { ChainType } from '../enums'
import { NetworkIdType } from '../types'

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
    type: ChainType
    networkId: NetworkIdType
    chainId: number
    coinType: number
    name: string
    explorerUrl?: string
}
