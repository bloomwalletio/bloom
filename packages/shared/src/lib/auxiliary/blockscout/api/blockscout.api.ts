import { NftStandard } from '@core/nfts/enums'
import { TokenStandard } from '@core/token/enums'
import { QueryParameters } from '@core/utils'
import { BaseApi } from '@core/utils/api'
import { DEFAULT_EXPLORER_URLS } from '@core/network/constants'
import { SupportedNetworkId } from '@core/network/enums'
import { IBlockscoutApi, IBlockscoutAsset, IBlockscoutAssetMetadata, IBlockscoutTransaction } from '../interfaces'
import { NetworkId } from '@core/network/types'

interface INextPageParams {
    block_number: number
    index: number
    items_count: number
}

interface IPaginationResponse<T> {
    items: T[]
    next_page_params: INextPageParams | null
}

export class BlockscoutApi extends BaseApi implements IBlockscoutApi {
    constructor(networkId: NetworkId) {
        const explorerUrl = DEFAULT_EXPLORER_URLS[networkId as SupportedNetworkId]
        super(`${explorerUrl}/api/v2`)
    }

    private async makePaginatedGetRequest<T>(
        path: string,
        queryParameters?: QueryParameters,
        items: T[] = [],
        nextPageParameters?: INextPageParams | null
    ): Promise<T[]> {
        if (nextPageParameters === null) {
            return Promise.resolve(items)
        }
        return this.get<IPaginationResponse<T>>(path, { ...queryParameters, ...nextPageParameters }).then(
            (response) => {
                if (!response) {
                    return Promise.resolve(items)
                }
                return this.makePaginatedGetRequest(
                    path,
                    queryParameters,
                    items.concat(response.items),
                    response.next_page_params
                )
            }
        )
    }

    async getAssetMetadata(assetAddress: string): Promise<IBlockscoutAssetMetadata | undefined> {
        const response = await this.get<IBlockscoutAssetMetadata>(`tokens/${assetAddress}`)
        if (response) {
            response.type = response.type.replace('-', '') as TokenStandard.Erc20 | NftStandard.Erc721
            return response
        }
    }

    async getAssetsForAddress(
        address: string,
        standard: TokenStandard.Erc20 | NftStandard.Erc721 = TokenStandard.Erc20
    ): Promise<IBlockscoutAsset[]> {
        const tokenType = standard.replace('ERC', 'ERC-')
        const path = `addresses/${address}/tokens`
        const response = await this.get<IPaginationResponse<IBlockscoutAsset>>(path, { type: tokenType })
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

    async getTransactionsForAddress(address: string): Promise<IBlockscoutTransaction[]> {
        const path = `addresses/${address}/transactions`
        const items = await this.makePaginatedGetRequest<IBlockscoutTransaction>(path)
        return items
    }
}
