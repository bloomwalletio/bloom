import { ContractType } from '@core/layer-2/enums'
import { Contract, Layer2AccountBalance } from '@core/layer-2/types'

import { IGetAddressBalanceOptions } from '../interfaces'
import { ChainConfiguration, ChainMetadata, Web3Provider } from '../types'
import { IBlock } from './block.interface'
import { IChainStatus } from './chain-status.interface'

export interface IChain {
    getConfiguration(): ChainConfiguration
    getStatus(): IChainStatus
    getProvider(): Web3Provider

    getMetadata(): Promise<ChainMetadata>
    getContract(type: ContractType, address: string): Contract
    getLatestBlock(): Promise<IBlock>
    getGasEstimate(hex: string): Promise<number>

    getBalanceOfAddress(address: string, options?: IGetAddressBalanceOptions): Promise<Layer2AccountBalance>
}
