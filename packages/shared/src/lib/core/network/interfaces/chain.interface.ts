import { ContractType } from '@core/layer-2/enums'
import { Contract } from '@core/layer-2/types'

import { ChainConfiguration, ChainMetadata, Web3Provider } from '../types'
import { IBlock } from './block.interface'
import { IChainStatus } from './chain-status.interface'
import { IGasCostEstimate } from '@core/network/interfaces/gas-cost-estimate.type'

export interface IChain {
    getConfiguration(): ChainConfiguration
    getStatus(): IChainStatus
    getProvider(): Web3Provider

    getMetadata(): Promise<ChainMetadata>
    getContract(type: ContractType, address: string): Contract
    getGasEstimate(hex: string): Promise<IGasCostEstimate>
    getLatestBlock(): Promise<IBlock>
}
