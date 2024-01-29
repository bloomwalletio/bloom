<script lang="ts">
    import { Indicator, Pill } from '@bloomwalletio/ui'
    import { CampaignStatus, ICampaign, calculateCampaignStatus } from '@contexts/campaigns'
    import { time } from '@core/app/stores'
    import { localize } from '@core/i18n'

    export let campaign: ICampaign

    $: campaignStatus = calculateCampaignStatus(campaign, $time)

    const STATUS_COLORS: { [status in CampaignStatus]: 'info' | 'success' | 'danger' | 'warning' } = {
        [CampaignStatus.Upcoming]: 'info',
        [CampaignStatus.Active]: 'success',
        [CampaignStatus.Ended]: 'danger',
        [CampaignStatus.Draft]: 'warning',
    }
</script>

<Pill color={STATUS_COLORS[campaignStatus]} compact>
    <div class="flex flex-row space-x-1 items-center">
        {#if campaignStatus === CampaignStatus.Active}
            <Indicator size="sm" color={STATUS_COLORS[campaignStatus]} />
        {/if}
        <div>
            {localize(`general.${campaignStatus}`)}
        </div>
    </div>
</Pill>
