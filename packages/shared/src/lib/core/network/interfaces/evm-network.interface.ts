import { ContractType } from '@core/layer-2/enums'
import { Contract } from '@core/layer-2/types'

import { ChainMetadata, EvmNetworkId, Web3Provider } from '../types'
import { IBlock } from './block.interface'
import { IChainStatus } from './chain-status.interface'
import { EvmNetworkType, ChainId, NetworkNamespace } from '../enums'
import { IBaseNetwork } from './base-network.interface'

export interface IEvmNetwork extends IBaseNetwork {
    id: EvmNetworkId
    namespace: NetworkNamespace.Evm
    chainId: ChainId
    type: EvmNetworkType
    explorerUrl: string | undefined
    rpcEndpoint: string
    apiEndpoint: string
    aliasAddress: string

    provider: Web3Provider

    getStatus(): IChainStatus

    getMetadata(): Promise<ChainMetadata>
    getContract(type: ContractType, address: string): Contract
    getLatestBlock(): Promise<IBlock>
    getGasEstimate(hex: string): Promise<bigint>
}
