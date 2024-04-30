import { IAccountState } from '@core/account/interfaces'
import { ContractType } from '@core/layer-2/enums'
import { Contract } from '@core/layer-2/types'
import { ITokenBalance } from '@core/token/interfaces'
import { ChainId, NetworkNamespace, NetworkType } from '../enums'
import { EvmNetworkId, Web3Provider } from '../types'
import { IBaseNetwork, IBaseNetworkMetadata } from './base-network.interface'
import { IBlock } from './block.interface'
import { IIscChainMetadata } from './isc-chain-metadata.interface'

export interface IIscChain extends Omit<IEvmNetwork, 'type'> {
    type: NetworkType.Isc
    apiEndpoint: string
    aliasAddress: string

    getGasEstimate(hex: string): Promise<bigint>
    getMetadata(): Promise<IIscChainMetadata>
}

export interface IEvmNetwork extends Omit<IBaseNetwork, 'type'>, IBaseNetworkMetadata {
    type: NetworkType.Evm
    id: EvmNetworkId
    namespace: NetworkNamespace.Evm
    chainId: ChainId
    explorerUrl: string | undefined
    rpcEndpoint: string

    provider: Web3Provider

    getGasPrice(): Promise<bigint | undefined>
    getBalance(account: IAccountState): Promise<ITokenBalance | undefined>

    getContract(type: ContractType, address: string): Contract
    getLatestBlock(): Promise<IBlock>
}
