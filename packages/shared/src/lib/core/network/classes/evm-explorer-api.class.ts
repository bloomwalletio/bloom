import { TokenStandard } from '@core/token/enums'
import { BaseApi } from '@core/utils/api'

import { DEFAULT_EXPLORER_URLS } from '../constants'
import { IExplorerApi } from '../interfaces'
import { NetworkId } from '../types'

export class EvmExplorerApi extends BaseApi implements IExplorerApi {
    constructor(private readonly networkId: NetworkId) {
        const explorerUrl = DEFAULT_EXPLORER_URLS[networkId]
        super(`${explorerUrl}/api/v2`)
    }

    async getAssetMetadata(assetAddress: string): Promise<IExplorerAssetMetadata> {
        return await this.get<IExplorerAssetMetadata>(`tokens/${assetAddress}`)
    }

    async getAssetsForAddress(address: string, tokenStandards?: TokenStandard[]): Promise<IExplorerAsset[]> {
        const queryString = `type=${(tokenStandards ?? [TokenStandard.Erc20])
            .map((standard) => standard.replace('ERC', 'ERC-'))
            .join(',')}`
        const response = await this.get<{ items: IExplorerAsset[]; next_page_params: unknown }>(
            `addresses/${address}/tokens?${queryString}`
        )

        return response.items.map((asset) => ({ ...asset, type: asset.type.replace('-', '') as TokenStandard }))
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
