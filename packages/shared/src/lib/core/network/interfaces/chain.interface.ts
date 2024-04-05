import { ContractType } from '@core/layer-2/enums'
import { Contract } from '@core/layer-2/types'

import { ChainConfiguration, ChainMetadata, Web3Provider } from '../types'
import { IBlock } from './block.interface'
import { IChainStatus } from './chain-status.interface'

export interface IChain {
    provider: Web3Provider

    getConfiguration(): ChainConfiguration
    getStatus(): IChainStatus

    getMetadata(): Promise<ChainMetadata>
    getContract(type: ContractType, address: string): Contract
    getLatestBlock(): Promise<IBlock>
    getGasEstimate(hex: string): Promise<bigint>
}
