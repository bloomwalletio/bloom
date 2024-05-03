import { IAccountState } from '@core/account/interfaces'
import { ContractType } from '@core/layer-2/enums'
import { Contract } from '@core/layer-2/types'
import { ITokenBalance } from '@core/token/interfaces'
import { ChainId, NetworkNamespace, NetworkType } from '../enums'
import { EvmNetworkId, EvmNetworkType, Web3Provider } from '../types'
import { IBaseNetwork, IBaseNetworkMetadata } from './base-network.interface'
import { IBlock } from './block.interface'
import { IIscChainMetadata } from './isc-chain-metadata.interface'
import { Nft } from '@core/nfts/interfaces'
import { IAccountState } from '@core/account/interfaces'

export interface IIscChain extends IEvmNetwork {
    type: NetworkType.Isc
    apiEndpoint: string
    aliasAddress: string

    getGasEstimate(hex: string): Promise<bigint>
    getMetadata(): Promise<IIscChainMetadata>
}

export interface IEvmNetwork extends IBaseNetwork, IBaseNetworkMetadata {
    type: EvmNetworkType
    id: EvmNetworkId
    namespace: NetworkNamespace.Evm
    chainId: ChainId
    explorerUrl: string | undefined
    rpcEndpoint: string

    provider: Web3Provider

    getGasPrice(): Promise<bigint | undefined>
    getBalance(account: IAccountState): Promise<ITokenBalance | undefined>
    loadNfts(account: IAccountState): Promise<Nft[]>

    getContract(type: ContractType, address: string): Contract
    getLatestBlock(): Promise<IBlock>
}
