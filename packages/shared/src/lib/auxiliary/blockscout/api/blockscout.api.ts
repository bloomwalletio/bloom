import { NftStandard } from '@core/nfts/enums'
import { TokenStandard } from '@core/token/enums'
import { QueryParameters } from '@core/utils'
import { BaseApi } from '@core/utils/api'
import { DEFAULT_EXPLORER_URLS } from '@core/network/constants'
import { SupportedNetworkId } from '@core/network/enums'
import {
    IBlockscoutApi,
    IBlockscoutAsset,
    IBlockscoutTokenInfo,
    IBlockscoutTokenTransfer,
    IBlockscoutTransaction,
} from '../interfaces'
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

export type BlockscoutExitFunction<T> = (items: T[]) => boolean

export class BlockscoutApi extends BaseApi implements IBlockscoutApi {
    constructor(networkId: NetworkId) {
        const explorerBaseUrl = DEFAULT_EXPLORER_URLS[networkId as SupportedNetworkId]
        super(explorerBaseUrl, 'api/v2')
    }

    private async makePaginatedGetRequest<T>(
        path: string,
        queryParameters?: QueryParameters,
        items: T[] = [],
        nextPageParameters?: INextPageParams | null,
        exitFunction?: BlockscoutExitFunction<T>
    ): Promise<T[]> {
        if (nextPageParameters === null) {
            return Promise.resolve(items)
        }
        if (exitFunction && exitFunction(items)) {
            return Promise.resolve(items)
        }
        return this.get<IPaginationResponse<T>>(path, { ...queryParameters, ...nextPageParameters }).then(
            (response) => {
                if (!response?.items) {
                    return Promise.resolve(items)
                }
                return this.makePaginatedGetRequest(
                    path,
                    queryParameters,
                    items.concat(response.items),
                    response.next_page_params,
                    exitFunction
                )
            }
        )
    }

    async getAssetMetadata(assetAddress: string): Promise<IBlockscoutTokenInfo | undefined> {
        const response = await this.get<IBlockscoutTokenInfo>(`tokens/${assetAddress}`)
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
        const items = await this.makePaginatedGetRequest<IBlockscoutAsset>(path, { type: tokenType })
        return items.map((asset) => ({
            ...asset,
            token: {
                ...asset.token,
                type: asset.token.type.replace('-', ''),
            },
        }))
    }

    async getTransactionsForAddress(
        address: string,
        exitFunction?: BlockscoutExitFunction<IBlockscoutTransaction>
    ): Promise<IBlockscoutTransaction[]> {
        const path = `addresses/${address}/transactions`
        const items = await this.makePaginatedGetRequest<IBlockscoutTransaction>(
            path,
            undefined,
            [],
            undefined,
            exitFunction
        )
        return items
    }

    async getTokenTransfersForAddress(
        address: string,
        standards?: ('ERC-20' | 'ERC-721')[],
        exitFunction?: BlockscoutExitFunction<IBlockscoutTokenTransfer>
    ): Promise<IBlockscoutTokenTransfer[]> {
        const path = `addresses/${address}/token-transfers`
        const items = await this.makePaginatedGetRequest<IBlockscoutTokenTransfer>(
            path,
            standards && standards?.length > 0 ? { type: standards } : undefined,
            [],
            undefined,
            exitFunction
        )
        return items
    }
}
