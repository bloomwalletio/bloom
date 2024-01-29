import { CampaignStatus } from '../enums'
import { ICampaign } from '../interfaces'

export function calculateCampaignStatus(campaign: ICampaign, now: Date): CampaignStatus {
    const startDate = new Date(campaign.startTime)
    const endDate = new Date(campaign.endTime)

    if (campaign.listingStatus === 'LISTED') {
        if (now < startDate) {
            return CampaignStatus.Upcoming
        } else if (now > endDate) {
            return CampaignStatus.Ended
        } else {
            return CampaignStatus.Active
        }
    } else {
        return CampaignStatus.Draft
    }
}
