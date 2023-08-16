import { ChainType, EvmChainId, NetworkNamespace, TangleNetworkName } from '../enums'
import { NetworkId } from '../types'

export interface IIscpChainConfiguration extends IBaseChainConfiguration {
    type: ChainType.Iscp
    networkName: TangleNetworkName | string
    protocol: NetworkNamespace.Stardust
    aliasAddress: string
    iscpEndpoint: string
}

export interface IEvmChainConfiguration extends IBaseChainConfiguration {
    type: ChainType.Evm
    chainId: EvmChainId | number
    protocol: NetworkNamespace.Evm
    rpcEndpoint: string
    symbol: string
    ticker: string
}

export interface IBaseChainConfiguration {
    id: NetworkId
    type: ChainType
    coinType: number
    name: string
    explorerUrl?: string
}
