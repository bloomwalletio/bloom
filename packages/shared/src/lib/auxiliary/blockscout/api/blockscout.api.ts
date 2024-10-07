import { NftStandard } from '@core/nfts/enums'
import { TokenStandard } from '@core/token/enums'
import { QueryParameters } from '@core/utils'
import { BaseApi } from '@core/utils/api'
import {
    IBlockscoutApi,
    IBlockscoutAsset,
    IBlockscoutAssetDto,
    IBlockscoutStats,
    IBlockscoutTokenInfo,
    IBlockscoutTokenInfoDto,
    IBlockscoutTransaction,
} from '../interfaces'
import { BlockscoutTokenTransfer } from '../types'

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
    constructor(explorerUrl: string) {
        super(explorerUrl, 'api/v2')
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
        return this.get<IPaginationResponse<T>>({
            path,
            queryParameters: { ...queryParameters, ...nextPageParameters },
        }).then((response) => {
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
        })
    }

    async getBackendVersion(): Promise<string | undefined> {
        const response = await this.get<{ backend_version }>({ path: 'config/backend-version' })
        return response?.['backend_version']
    }

    async getStats(): Promise<IBlockscoutStats | undefined> {
        const response = await this.get<IBlockscoutStats>({ path: 'stats' })
        if (response) {
            return this.get({ path: 'stats' })
        }
    }

    async getAssetMetadata(assetAddress: string): Promise<IBlockscoutTokenInfo | undefined> {
        const response = await this.get<IBlockscoutTokenInfoDto>({ path: `tokens/${assetAddress}` })
        if (response) {
            return {
                ...response,
                type: response.type.replace('-', '') as TokenStandard.Erc20 | NftStandard.Erc721,
            }
        }
    }

    async getAssetsForAddress(
        address: string,
        standard: TokenStandard.Erc20 | NftStandard.Erc721 = TokenStandard.Erc20
    ): Promise<IBlockscoutAsset[]> {
        const tokenType = standard.replace('ERC', 'ERC-')
        const path = `addresses/${address}/tokens`
        const items = await this.makePaginatedGetRequest<IBlockscoutAssetDto>(path, { type: tokenType })
        return items.map((asset) => ({
            ...asset,
            token: {
                ...asset.token,
                type: asset.token.type.replace('-', '') as TokenStandard.Erc20 | NftStandard.Erc721,
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
        exitFunction?: BlockscoutExitFunction<BlockscoutTokenTransfer>
    ): Promise<BlockscoutTokenTransfer[]> {
        const path = `addresses/${address}/token-transfers`
        const items = await this.makePaginatedGetRequest<BlockscoutTokenTransfer>(
            path,
            standards && standards?.length > 0 ? { type: standards } : undefined,
            [],
            undefined,
            exitFunction
        )
        return items
    }
}
