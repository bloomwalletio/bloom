<script lang="ts">
    import { Pill, Icon, IconName } from '@bloomwalletio/ui'
    import { ICampaign } from '@contexts/campaigns'
    import { time } from '@core/app/stores'
    import { getTimeDifference } from '@core/utils'

    export let campaign: ICampaign

    $: timeDifference = getTimeDifference(new Date(campaign.endTime), $time)
</script>

{#if timeDifference}
    <Pill color="neutral" compact>
        <div class="flex flex-row space-x-1 items-center">
            <Icon size="xxs" customColor="neutral" name={IconName.Hourglass} />
            <div>{getTimeDifference(new Date(campaign.endTime), $time)}</div>
        </div>
    </Pill>
{/if}
