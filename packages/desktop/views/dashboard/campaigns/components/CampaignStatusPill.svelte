<script lang="ts">
    import { Pill, Indicator } from '@bloomwalletio/ui'
    import { ICampaign } from '@contexts/campaigns'
    import { time } from '@core/app/stores'

    export let campaign: ICampaign

    $: campaignStatus = calculateCampaignStatus($time)

    enum CampaignStatus {
        Upcoming = 'upcoming',
        Active = 'active',
        Ended = 'ended',
        Draft = 'draft',
    }

    function calculateCampaignStatus(now: Date) {
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
</script>

<Pill color="green" compact>
    <div class="flex flex-row space-x-1 items-center">
        <Indicator size="sm" color="success" />
        <div>
            {campaignStatus}
        </div>
    </div>
</Pill>
