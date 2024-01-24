import { BaseApi, buildQueryParametersFromObject } from '@core/utils'
import { TIDE_API_BASE_URL } from '../constants'
import { ITideLeaderboardItem, ITideUserPosition } from '../interfaces'
import { TideApiEndpoint } from '../enums'
import { NetworkId } from '@core/network'
import { INftAttribute } from '@core/nfts'

type ProjectLeaderboardQueryParams = {
    nextPage?: number
    by?: string
    search?: string
    pageSize?: number
    onlyListedCampaigns?: boolean
    lastDays?: number
    currentPeriod?: boolean
    cids?: string[]
}

interface IProjectLeaderboardResponse {
    leaderboardFiltered: ITideLeaderboardItem[]
    nextPage: number
    leaderboardUserCount: number
    userPosition: ITideUserPosition
}

interface INftUserDataResponse {
    tokenId: string
    description: string
    image: string
    external_url: string
    attributes: INftAttribute[]
    userPosition: ITideUserPosition
}

export class TideApi extends BaseApi {
    constructor() {
        super(TIDE_API_BASE_URL)
    }

    async getProjectLeaderboard(
        projectId: number,
        queryParams?: ProjectLeaderboardQueryParams
    ): Promise<IProjectLeaderboardResponse | undefined> {
        const path = `${TideApiEndpoint.Project}/${projectId}/leaderboard?${
            queryParams ? buildQueryParametersFromObject(queryParams) : ''
        }`
        const response = await this.get<IProjectLeaderboardResponse>(path)
        return response
    }

    async getNftUserData(
        chainId: NetworkId,
        userAddress: string,
        contractAddress: string
    ): Promise<INftUserDataResponse | undefined> {
        const path = `${TideApiEndpoint.Nft}/${userAddress}/${contractAddress}/${chainId}`
        const response = await this.get<INftUserDataResponse>(path)
        return response
    }
}
