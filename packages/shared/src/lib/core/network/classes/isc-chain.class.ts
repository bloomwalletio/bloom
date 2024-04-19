import { get } from 'svelte/store'

import Web3 from 'web3'

import { EVM_CONTRACT_ABIS } from '@core/layer-2/constants'
import { ContractType } from '@core/layer-2/enums'
import { Contract } from '@core/layer-2/types'

import { EvmNetworkType, NetworkHealth, NetworkNamespace, ChainId } from '../enums'
import { IBlock, IEvmNetworkStatus, IIscNetworkConfiguration, IIscChainMetadata, IIscChain } from '../interfaces'
import { evmNetworkStatuses } from '../stores'
import { CoinType } from '@iota/sdk/out/types'
import { EvmNetworkId, Web3Provider } from '../types'
import { Converter } from '@core/utils'

export class IscChain implements IIscChain {
    public readonly provider: Web3Provider
    private readonly _chainApi: string

    public readonly id: EvmNetworkId
    public readonly namespace: NetworkNamespace.Evm
    public readonly chainId: ChainId
    public readonly type: EvmNetworkType.Isc
    public readonly coinType: CoinType
    public readonly name: string
    public readonly explorerUrl: string | undefined
    public readonly rpcEndpoint: string
    public readonly apiEndpoint: string
    public readonly aliasAddress: string

    private _metadata: IIscChainMetadata | undefined
    constructor({
        id,
        namespace,
        chainId,
        type,
        coinType,
        name,
        explorerUrl,
        rpcEndpoint,
        aliasAddress,
        apiEndpoint,
    }: IIscNetworkConfiguration) {
        try {
            /**
             * NOTE: We can assume that the data inside this payload has already
             * been validated.
             */
            const evmJsonRpcPath = this.buildEvmJsonRpcPath(aliasAddress)

            this.provider = new Web3(`${rpcEndpoint}/${evmJsonRpcPath}`)

            this.id = id
            this.namespace = namespace
            this.chainId = chainId
            this.type = type
            this.coinType = coinType
            this.name = name
            this.explorerUrl = explorerUrl
            this.rpcEndpoint = rpcEndpoint
            this.aliasAddress = aliasAddress
            this.apiEndpoint = apiEndpoint

            this._chainApi = `${apiEndpoint}v1/chains/${aliasAddress}`
        } catch (err) {
            console.error(err)
            throw new Error('Failed to construct ISCP Chain!')
        }
    }

    private buildEvmJsonRpcPath(aliasAddress: string): string {
        /**
         * NOTE: This is according to the WASP node API specification,
         * which can be found here: https://editor.swagger.io/?url=https://raw.githubusercontent.com/iotaledger/wasp/develop/clients/apiclient/api/openapi.yaml.
         */
        return `v1/chains/${aliasAddress}/evm`
    }

    getStatus(): IEvmNetworkStatus {
        return get(evmNetworkStatuses)?.[this.id] ?? { health: NetworkHealth.Disconnected }
    }

    getContract(type: ContractType, address: string): Contract {
        const abi = EVM_CONTRACT_ABIS[type]
        if (!abi) {
            throw new Error(`Unable to determine contract type "${type}"`)
        }
        return new this.provider.eth.Contract(abi, address)
    }

    getMetadata(): Promise<IIscChainMetadata> {
        if (this._metadata) {
            return Promise.resolve(this._metadata)
        } else {
            this._metadata = <IIscChainMetadata>{} // await this.fetchChainMetadata()
            return Promise.resolve(this._metadata)
        }
    }

    /**
     * CAUTION: The API endpoint used by this method is not available
     * with the public ShimmerEVM node URL (b/c it's actually just
     * the EVM JSON-RPC endpoint rather than the underlying WASP
     * node URL). See here for more: https://github.com/iotaledger/wasp/issues/2385
     */
    private async fetchChainMetadata(): Promise<IIscChainMetadata> {
        const response = await fetch(this._chainApi)
        return (await response.json()) as IIscChainMetadata
    }

    async getLatestBlock(): Promise<IBlock> {
        const number = await this.provider.eth.getBlockNumber()
        return this.provider.eth.getBlock(number)
    }

    async getGasEstimate(hex: string): Promise<bigint> {
        const URL = `${this._chainApi}/estimategas-onledger`
        const body = JSON.stringify({ outputBytes: hex })

        const requestInit: RequestInit = {
            method: 'POST',
            body,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }

        const response = await fetch(URL, requestInit)
        const data = await response.json()

        if (response.status === 200) {
            const gasEstimate = Converter.bigIntLikeToBigInt(data.gasFeeCharged)
            if (gasEstimate === BigInt(0)) {
                throw new Error(`Gas fee has an invalid value: ${gasEstimate}!`)
            }

            return gasEstimate
        } else {
            throw new Error(data)
        }
    }
}
