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
    listingStatus: 'LISTED'
}
