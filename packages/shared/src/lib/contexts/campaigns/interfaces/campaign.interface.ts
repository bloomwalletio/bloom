export interface ICampaign {
    id: string
    projectId: number
    title: string
    description: string
    imageUrl: string
    participants: number
    startTime: string
    endTime: string
    url: string
    listingStatus: 'LISTED'
    ERC20Reward: unknown
}
