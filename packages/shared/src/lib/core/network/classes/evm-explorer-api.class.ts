import { TokenStandard } from '@core/token/enums'

import { DEFAULT_EXPLORER_URLS } from '../constants'
import { IExplorerApi } from '../interfaces'
import { NetworkId } from '../types'

export class EvmExplorerApi implements IExplorerApi {
    constructor(private readonly networkId: NetworkId) {}

    async getAssetMetadata(assetAddress: string): Promise<IExplorerAssetMetadata> {
        return await this.makeApiRequest<IExplorerAssetMetadata>(`${this.buildApiUrl()}/tokens/${assetAddress}`)
    }

    async getAssetsForAddress(address: string, tokenStandards?: TokenStandard[]): Promise<IExplorerAsset[]> {
        const queryString = `type=${(tokenStandards ?? [TokenStandard.Erc20])
            .map((standard) => standard.replace('ERC', 'ERC-'))
            .join(',')}`
        const response = await this.makeApiRequest<{ items: IExplorerAsset[]; next_page_params: unknown }>(
            `${this.buildApiUrl()}/addresses/${address}/tokens?${queryString}`
        )
        return response.items
    }

    private buildApiUrl(): string {
        const explorerUrl = DEFAULT_EXPLORER_URLS[this.networkId]
        if (!explorerUrl) {
            throw new Error('Unable to create explorer API URL')
        }

        return `${explorerUrl}/api/v2`
    }

    private async makeApiRequest<T>(apiUrl: string): Promise<T> {
        const requestInit: RequestInit = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }

        const response = await fetch(apiUrl, requestInit)
        return (await response.json()) as T
    }
}

export interface IExplorerAsset {
    token: IExplorerAssetMetadata
    token_id: string
    token_instance: unknown
    value: string
}

// TODO: Change to real asset metadata and align with other code
export interface IExplorerAssetMetadata {
    address: string
    circulating_market_cap: string
    decimals: number
    exchange_rate: string
    holders: string
    icon_url: string
    name: string
    symbol: string
    total_supply: string
    type: TokenStandard
}
