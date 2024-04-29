import { get } from 'svelte/store'

import { NetworkHealth } from '../enums'
import { IBlock, IEvmNetworkStatus, IIscChainConfiguration, IIscChainMetadata } from '../interfaces'
import { evmNetworkStatuses } from '../stores'
import { Converter } from '@core/utils'
import { BaseEvmNetwork } from './base-evm-network.class'

export class IscChain extends BaseEvmNetwork {
    private readonly _chainApi: string
    private _metadata: IIscChainMetadata | undefined

    public readonly explorerUrl: string | undefined
    public readonly apiEndpoint: string
    public readonly aliasAddress: string

    constructor(chainConfiguration: IIscChainConfiguration) {
        try {
            const { rpcEndpoint, aliasAddress, apiEndpoint } = chainConfiguration
            const _rpcEndpoint = new URL(`v1/chains/${aliasAddress}/evm`, rpcEndpoint).href

            chainConfiguration.rpcEndpoint = _rpcEndpoint
            super(chainConfiguration)

            this.aliasAddress = aliasAddress
            this.apiEndpoint = apiEndpoint

            this._chainApi = new URL(`v1/chains/${aliasAddress}`, apiEndpoint).href
        } catch (err) {
            console.error(err)
            throw new Error('Failed to construct isc Chain!')
        }
    }

    getStatus(): IEvmNetworkStatus {
        return get(evmNetworkStatuses)?.[this.id] ?? { health: NetworkHealth.Disconnected }
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
