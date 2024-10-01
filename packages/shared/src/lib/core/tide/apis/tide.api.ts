import { INftAttribute } from '@core/nfts'
import { BaseApi } from '@core/utils'
import { TIDE_API_BASE_URL } from '../constants'
import { TideApiEndpoint } from '../enums'
import { ITideLeaderboardItem, ITideUserPosition } from '../interfaces'

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
    filteredLeaderboard: ITideLeaderboardItem[]
    nextPage: number
    leaderboardUserCount: number
    userPosition: ITideUserPosition
}

interface ICampaignsResponse {
    id: string
    title: string
    description: string
    imageUrl: string
    imagePreviewUrl: string
    isBanned: boolean
    startTime: string
    endTime: string
    address: string
    chain: number
    url: string
    evmNetwork: number
    projectId: number
    projectLinks: string[]
    successMessage: string
    isGasless: boolean
    isSoulbound: boolean
    listingStatus: string
    template: {
        type: string
        name: string
    }
    isCreationCompleted: boolean
    externalReward: number
    createdAt: string
    updatedAt: string
    ipfsHash: string
    participants: number
    step: number
    ERC20Reward: unknown
    pickedByTide: boolean
}

interface ICampaignResponse extends ICampaignsResponse {
    numberOfTasks: number
}

interface IMultipleCampaignsResponse {
    campaigns: ICampaignsResponse[]
    totalCampaigns: number
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
        super(TIDE_API_BASE_URL, 'public')
    }

    async getProjectLeaderboard(
        projectId: number,
        queryParams?: ProjectLeaderboardQueryParams
    ): Promise<IProjectLeaderboardResponse | undefined> {
        const path = `${TideApiEndpoint.Project}/${projectId}/leaderboard`
        const response = await this.get<IProjectLeaderboardResponse>({ path, queryParameters: queryParams })
        return response
    }

    async getCampaign(campaignId: string): Promise<ICampaignResponse | undefined> {
        const path = `${TideApiEndpoint.Campaign}/${campaignId}`
        const response = await this.get<ICampaignResponse>({ path })
        return response
    }

    async getCampaignsForChain(chainId: number): Promise<IMultipleCampaignsResponse | undefined> {
        const path = `${TideApiEndpoint.Campaign}/chain/${chainId}`
        const response = await this.get<IMultipleCampaignsResponse>({ path })
        return response
    }

    async getNftUserData(
        chainId: number,
        userAddress: string,
        contractAddress: string
    ): Promise<INftUserDataResponse | undefined> {
        const path = `${TideApiEndpoint.Nft}/${userAddress}/${contractAddress}/${chainId}`
        const response = await this.get<INftUserDataResponse>({ path })
        return response
    }
}
