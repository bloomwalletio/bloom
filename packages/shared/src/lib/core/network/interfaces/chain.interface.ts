import { ContractType } from '@core/layer-2/enums'
import { Contract } from '@core/layer-2/types'

import { ChainMetadata, NetworkId, Web3Provider } from '../types'
import { IBlock } from './block.interface'
import { IChainStatus } from './chain-status.interface'
import { ChainType, EvmChainId, NetworkNamespace } from '../enums'
import { CoinType } from '@iota/sdk/out/types'

export interface IChain {
    id: NetworkId
    namespace: NetworkNamespace.Evm
    chainId: EvmChainId
    type: ChainType.Iscp
    coinType: CoinType
    name: string
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
