import { ContractType } from '@core/layer-2/enums'
import { Contract } from '@core/layer-2/types'

import { ChainMetadata, EvmNetworkId, Web3Provider } from '../types'
import { IBlock } from './block.interface'
import { IEvmNetworkStatus } from './evm-network-status.interface'
import { EvmNetworkType, ChainId, NetworkNamespace } from '../enums'
import { IBaseNetwork } from './base-network.interface'

export interface IIscpEvmNetwork extends IEvmNetwork {
    apiEndpoint: string
    aliasAddress: string
    getMetadata(): Promise<ChainMetadata>
    getGasEstimate(hex: string): Promise<bigint>
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
