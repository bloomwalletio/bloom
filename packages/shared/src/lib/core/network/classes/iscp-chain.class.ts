import { get } from 'svelte/store'

import Web3 from 'web3'

import { DEFAULT_EXPLORER_URLS } from '../constants'
import { NetworkHealth } from '../enums'
import { IBlock, IChain, IChainStatus, IIscpChainConfiguration, IIscpChainMetadata } from '../interfaces'
import { chainStatuses } from '../stores'
import { ChainConfiguration, ChainMetadata, Web3Provider } from '../types'
import { Contract } from '@core/layer-2/types'
import { ContractType } from '@core/layer-2/enums'
import { getAbiForContractType } from '@core/layer-2/utils'
import { IErc20TokenWithBalance, TokenStandard } from '@core/token'

export class IscpChain implements IChain {
    private readonly _provider: Web3Provider
    private readonly _configuration: IIscpChainConfiguration
    private readonly _chainApi: string

    private _metadata: IIscpChainMetadata | undefined
    constructor(payload: IIscpChainConfiguration) {
        try {
            /**
             * NOTE: We can assume that the data inside this payload has already
             * been validated.
             */
            const { aliasAddress, rpcEndpoint, apiEndpoint } = payload
            const evmJsonRpcPath = this.buildEvmJsonRpcPath(aliasAddress)

            this._provider = new Web3(`${rpcEndpoint}/${evmJsonRpcPath}`)
            this._configuration = payload
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

    private buildExplorerApiUrl(): string {
        return `${DEFAULT_EXPLORER_URLS[this._configuration.id]}/api/v2`
    }

    getConfiguration(): ChainConfiguration {
        return this._configuration
    }

    getStatus(): IChainStatus {
        return get(chainStatuses)?.[this._configuration.id] ?? { health: NetworkHealth.Disconnected }
    }

    getContract(type: ContractType, address: string): Contract {
        const abi = getAbiForContractType(type)
        return new this._provider.eth.Contract(abi, address)
    }

    getMetadata(): Promise<ChainMetadata> {
        if (this._metadata) {
            return Promise.resolve(this._metadata)
        } else {
            this._metadata = <IIscpChainMetadata>{} // await this.fetchChainMetadata()
            return Promise.resolve(this._metadata)
        }
    }

    getProvider(): Web3Provider {
        return this._provider
    }

    /**
     * CAUTION: The API endpoint used by this method is not available
     * with the public ShimmerEVM node URL (b/c it's actually just
     * the EVM JSON-RPC endpoint rather than the underlying WASP
     * node URL). See here for more: https://github.com/iotaledger/wasp/issues/2385
     */
    private async fetchChainMetadata(): Promise<IIscpChainMetadata> {
        const response = await fetch(this._chainApi)
        return (await response.json()) as IIscpChainMetadata
    }

    async getLatestBlock(): Promise<IBlock> {
        const number = await this._provider.eth.getBlockNumber()
        return this._provider.eth.getBlock(number)
    }

    async getGasEstimate(hex: string): Promise<number> {
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
            const gasEstimate = Number(data.gasFeeCharged ?? '0')
            if (Number.isNaN(gasEstimate) || gasEstimate === 0) {
                throw new Error(`Gas fee has an invalid value: ${gasEstimate}!`)
            }

            return gasEstimate
        } else {
            throw new Error(data)
        }
    }

    async getBalanceOfAddress(address: string, standard = TokenStandard.Erc20): Promise<IErc20TokenWithBalance[]> {
        const tokenType = standard.replace('ERC', 'ERC-')
        const apiUrl = `${this.buildExplorerApiUrl()}/addresses/${address}/tokens?type=${tokenType}`
        const requestInit: RequestInit = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }
        try {
            const response = await fetch(apiUrl, requestInit)
            const data: { items: { token: IErc20TokenWithBalance & { type: TokenStandard.Erc20 }; value: string }[] } =
                await response.json()

            const result: IErc20TokenWithBalance[] = []
            for (const { token, value } of data?.items ?? []) {
                result.push({
                    address: token.address,
                    value: BigInt(value),
                    name: token.name,
                    symbol: token.symbol,
                    decimals: token.decimals,
                    standard: token.type,
                })
            }
            return result
        } catch (err) {
            console.error(err)
            return []
        }
    }
}
