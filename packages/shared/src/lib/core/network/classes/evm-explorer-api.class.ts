import { NftStandard } from '@core/nfts/enums'
import { TokenStandard } from '@core/token/enums'
import { BaseApi } from '@core/utils/api'

import { DEFAULT_EXPLORER_URLS } from '../constants'
import { IExplorerApi, IExplorerAsset, IExplorerAssetMetadata } from '../interfaces'
import { NetworkId } from '../types'

export class EvmExplorerApi extends BaseApi implements IExplorerApi {
    constructor(networkId: NetworkId) {
        const explorerUrl = DEFAULT_EXPLORER_URLS[networkId]
        super(`${explorerUrl}/api/v2`)
    }

    async getAssetMetadata(assetAddress: string): Promise<IExplorerAssetMetadata | undefined> {
        const response = await this.get<IExplorerAssetMetadata>(`tokens/${assetAddress}`)
        if (response) {
            response.type = response.type.replace('-', '') as TokenStandard.Erc20 | NftStandard.Erc721
            return response
        }
    }

    async getAssetsForAddress(
        address: string,
        standard: TokenStandard.Erc20 | NftStandard.Erc721 = TokenStandard.Erc20
    ): Promise<IExplorerAsset[]> {
        const tokenType = standard.replace('ERC', 'ERC-')
        const response = await this.get<{ items: IExplorerAsset[]; next_page_params: unknown }>(
            `addresses/${address}/tokens?type=${tokenType}`
        )
        if (response) {
            return (response?.items ?? []).map((asset) => ({
                ...asset,
                token: {
                    ...asset.token,
                    type: asset.token.type.replace('-', ''),
                },
            }))
        } else {
            return []
        }
    }
}
