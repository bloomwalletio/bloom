import { TokenStandard } from '@core/token/enums'
import { BaseApi } from '@core/utils/api'

import { DEFAULT_EXPLORER_URLS } from '../constants'
import { IExplorerApi, IExplorerAsset, IExplorerAssetMetadata } from '../interfaces'
import { NetworkId } from '../types'

export class EvmExplorerApi extends BaseApi implements IExplorerApi {
    constructor(private readonly networkId: NetworkId) {
        const explorerUrl = DEFAULT_EXPLORER_URLS[networkId]
        super(`${explorerUrl}/api/v2`)
    }

    async getAssetMetadata(assetAddress: string): Promise<IExplorerAssetMetadata> {
        return await this.get<IExplorerAssetMetadata>(`tokens/${assetAddress}`)
    }

    async getAssetsForAddress(address: string, tokenStandard?: TokenStandard): Promise<IExplorerAsset[]> {
        const tokenType = (tokenStandard ?? TokenStandard.Erc20).replace('ERC', 'ERC-')
        const response = await this.get<{ items: IExplorerAsset[]; next_page_params: unknown }>(
            `addresses/${address}/tokens?type=${tokenType}`
        )
        return response.items.map((asset) => ({ ...asset, type: asset.token.type.replace('-', '') as TokenStandard }))
    }
}
