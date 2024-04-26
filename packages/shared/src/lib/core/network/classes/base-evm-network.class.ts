import { get, writable, Writable } from 'svelte/store'

import Web3 from 'web3'

import { EVM_CONTRACT_ABIS } from '@core/layer-2/constants'
import { ContractType } from '@core/layer-2/enums'
import { Contract } from '@core/layer-2/types'

import { EvmNetworkType, NetworkHealth, NetworkNamespace, ChainId } from '../enums'
import { IBlock, IEvmNetwork, IBaseEvmNetworkConfiguration } from '../interfaces'
import { CoinType } from '@iota/sdk/out/types'
import { EvmNetworkId, Web3Provider } from '../types'
import { NETWORK_STATUS_POLL_INTERVAL } from '@core/network/constants'

export class BaseEvmNetwork implements IEvmNetwork {
    public readonly provider: Web3Provider

    public readonly id: EvmNetworkId
    public readonly namespace: NetworkNamespace.Evm
    public readonly chainId: ChainId
    public readonly type: EvmNetworkType
    public readonly coinType: CoinType
    public readonly name: string
    public readonly explorerUrl: string | undefined
    public readonly rpcEndpoint: string

    public health: Writable<NetworkHealth> = writable(NetworkHealth.Operational)
    public statusPoll: number | undefined

    constructor({
        id,
        namespace,
        chainId,
        type,
        coinType,
        name,
        explorerUrl,
        rpcEndpoint,
    }: IBaseEvmNetworkConfiguration) {
        try {
            this.provider = new Web3(`${rpcEndpoint}`)

            this.id = id
            this.namespace = namespace
            this.chainId = chainId
            this.type = type
            this.coinType = coinType
            this.name = name
            this.explorerUrl = explorerUrl
            this.rpcEndpoint = rpcEndpoint

            void this.startStatusPoll()
        } catch (err) {
            console.error(err)
            throw new Error('Failed to construct EVM Network!')
        }
    }

    startStatusPoll(): void {
        this.statusPoll = window.setInterval(() => {
            this.health.set(
                get(this.health) === NetworkHealth.Operational ? NetworkHealth.Degraded : NetworkHealth.Operational
            )
            this.getLatestBlock()
                .then(() => this.health.set(NetworkHealth.Operational))
                .catch(() => this.health.set(NetworkHealth.Disconnected))
        }, NETWORK_STATUS_POLL_INTERVAL)
    }

    destroy(): void {
        clearInterval(this.statusPoll)
    }

    getContract(type: ContractType, address: string): Contract {
        const abi = EVM_CONTRACT_ABIS[type]
        if (!abi) {
            throw new Error(`Unable to determine contract type "${type}"`)
        }
        return new this.provider.eth.Contract(abi, address)
    }

    async getLatestBlock(): Promise<IBlock> {
        const number = await this.provider.eth.getBlockNumber()
        return this.provider.eth.getBlock(number)
    }
}
