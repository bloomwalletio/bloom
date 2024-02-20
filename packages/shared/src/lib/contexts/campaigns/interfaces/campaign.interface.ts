import { TideListingStatus } from '@core/tide'

export interface ICampaign {
    id: string
    projectId: number
    title: string
    description: string
    address: string
    imageUrl: string
    participants: number
    startTime: string
    endTime: string
    url: string
    chainId: number
    listingStatus: TideListingStatus
    ERC20Reward: unknown
}
