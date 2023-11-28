import { TokenStandard } from '@core/token/enums'

import { DEFAULT_EXPLORER_URLS } from '../constants'
import { IExplorerApi } from '../interfaces'
import { NetworkId } from '../types'

export class EvmExplorerApi implements IExplorerApi {
    constructor(private readonly networkId: NetworkId) {}

    async getAssetMetadata(assetAddress: string): Promise<unknown> {
        return await this.makeApiRequest<unknown>(`${this.buildApiUrl()}/tokens/${assetAddress}`)
    }

    async getAssetsForAddress(address: string, tokenStandards?: TokenStandard[]): Promise<unknown> {
        const queryString = `type=${(tokenStandards ?? [TokenStandard.Erc20])
            .map((standard) => standard.replace('ERC', 'ERC-'))
            .join(',')}`
        return await this.makeApiRequest<unknown>(`${this.buildApiUrl()}/addresses/${address}/tokens?${queryString}`)
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
        return await response.json()
    }
}
