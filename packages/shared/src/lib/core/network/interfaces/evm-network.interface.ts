import { IAccountState } from '@core/account/interfaces'
import { Nft } from '@core/nfts/interfaces'
import { ITokenBalance } from '@core/token/interfaces'
import { ChainId, NetworkNamespace, NetworkType } from '../enums'
import { EvmNetworkId, EvmNetworkType, Web3Provider } from '../types'
import { IBaseNetwork, IBaseNetworkMetadata } from './base-network.interface'
import { IIscChainMetadata } from './isc-chain-metadata.interface'
import { BigIntLike } from '@ethereumjs/util'
import { Block, Contract, ContractAbi } from 'web3'
import { IGasPricesBySpeed } from '@core/layer-2'

export interface IIscChain extends IEvmNetwork {
    type: NetworkType.Isc
    apiEndpoint: string
    aliasAddress: string

    getGasFeeEstimate(hex: string): Promise<bigint>
    getMetadata(): IIscChainMetadata | undefined
    setMetadata(): Promise<void>

    normaliseAmount(amount: BigIntLike): bigint
    denormaliseAmount(amount: BigIntLike): bigint
}

export interface IEvmNetwork extends IBaseNetwork, IBaseNetworkMetadata {
    type: EvmNetworkType
    id: EvmNetworkId
    namespace: NetworkNamespace.Evm
    chainId: ChainId
    rpcEndpoint: string

    provider: Web3Provider

    getRequiredGasPrice(): Promise<bigint | undefined>
    getGasPrices(): Promise<IGasPricesBySpeed | undefined>
    getBalance(account: IAccountState): Promise<ITokenBalance | undefined>
    getNftsForAccount(account: IAccountState): Promise<Nft[]>

    getContract(abi: ContractAbi, address: string): Contract<ContractAbi>
    getLatestBlock(): Promise<Block>
}
