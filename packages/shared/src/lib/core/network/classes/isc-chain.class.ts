import { IIscChainConfiguration, IIscChainMetadata } from '../interfaces'
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
            const _rpcEndpoint = `${rpcEndpoint}/v1/chains/${aliasAddress}/evm`
            chainConfiguration.rpcEndpoint = _rpcEndpoint
            super(chainConfiguration)

            this.aliasAddress = aliasAddress
            this.apiEndpoint = apiEndpoint

            this._chainApi = `${apiEndpoint}v1/chains/${aliasAddress}`

            void this.setMetadata()
        } catch (err) {
            console.error(err)
            throw new Error('Failed to construct isc Chain!')
        }
    }

    async setMetadata(): Promise<void> {
        try {
            this._metadata = await this.fetchChainMetadata()
        } catch (err) {
            console.error(err)
        }
    }

    getMetadata(): IIscChainMetadata | undefined {
        return this._metadata
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

    async getGasFeeEstimate(outputBytes: string): Promise<bigint> {
        const URL = `${this._chainApi}/estimategas-onledger`
        const body = JSON.stringify({ outputBytes })

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
            const gasFee = BigInt(data.gasFeeCharged)
            if (gasFee === BigInt(0)) {
                throw new Error(`Gas fee has an invalid value: ${gasFee}!`)
            }

            return gasFee
        } else {
            throw new Error(data)
        }
    }
}
