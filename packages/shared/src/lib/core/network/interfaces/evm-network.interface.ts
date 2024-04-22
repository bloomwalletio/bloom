import { ContractType } from '@core/layer-2/enums'
import { Contract } from '@core/layer-2/types'

import { EvmNetworkType, ChainId, NetworkNamespace } from '../enums'
import { EvmNetworkId, Web3Provider } from '../types'
import { IBlock } from './block.interface'
import { IEvmNetworkStatus } from './evm-network-status.interface'
import { IBaseNetwork } from './base-network.interface'
import { IIscChainMetadata } from './isc-chain-metadata.interface'

export interface IIscChain extends IEvmNetwork {
    apiEndpoint: string
    aliasAddress: string

    getGasEstimate(hex: string): Promise<bigint>
    getMetadata(): Promise<IIscChainMetadata>
}

export interface IEvmNetwork extends IBaseNetwork {
    id: EvmNetworkId
    namespace: NetworkNamespace.Evm
    chainId: ChainId
    type: EvmNetworkType
    explorerUrl: string | undefined
    rpcEndpoint: string

    provider: Web3Provider

    getStatus(): IEvmNetworkStatus

    getContract(type: ContractType, address: string): Contract
    getLatestBlock(): Promise<IBlock>
}
