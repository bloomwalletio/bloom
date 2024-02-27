import { NftStandard } from '@core/nfts/enums'
import { TokenStandard } from '@core/token/enums'
import { QueryParameters } from '@core/utils'
import { BaseApi } from '@core/utils/api'
import { DEFAULT_EXPLORER_URLS } from '../constants'
import { IExplorerApi, IExplorerAsset, IExplorerAssetMetadata } from '../interfaces'
import { SupportedNetworkId } from '../enums'

interface INextPageParams {
    block_number: number
    index: number
    items_count: number
}

interface IPaginationResponse<T> {
    items: T[]
    next_page_params: INextPageParams | null
}

export class EvmExplorerApi extends BaseApi implements IExplorerApi {
    constructor(networkId: SupportedNetworkId) {
        const explorerUrl = DEFAULT_EXPLORER_URLS[networkId]
        super(`${explorerUrl}/api/v2`)
    }

    private async makePaginatedRequest<T>(
        api: BaseApi,
        path: string,
        queryParameters: QueryParameters,
        items: T[] = [],
        nextPageParameters: INextPageParams | null = null
    ): Promise<T[]> {
        if (!nextPageParameters) {
            return Promise.resolve(items)
        }
        return this.get<IPaginationResponse<T>>(path, { ...queryParameters, ...nextPageParameters }).then(
            (response) => {
                if (!response) {
                    return Promise.resolve(items)
                }
                return this.makePaginatedRequest(
                    api,
                    path,
                    queryParameters,
                    items.concat(response.items),
                    response.next_page_params
                )
            }
        )
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
        const response = await this.get<IPaginationResponse<IExplorerAsset>>(`addresses/${address}/tokens`, {
            token_type: tokenType,
        })
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
