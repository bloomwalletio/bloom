<script lang="ts">
    import { ActivityAsyncStatusPill } from '@ui'
    import { Pill } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { time } from '@core/app/stores'
    import { Activity, ActivityAsyncStatus } from '@core/activity'

    export let activity: Activity

    $: timelockDate = activity.asyncData?.timelockDate
    $: isTimelocked = timelockDate && timelockDate > $time

    $: hasPills =
        (activity.asyncData?.asyncStatus && activity?.asyncData?.asyncStatus !== ActivityAsyncStatus.Timelocked) ||
        isTimelocked ||
        activity?.parsedLayer2Metadata
</script>

{#if hasPills}
    <transaction-status class="flex flex-row w-full space-x-2 justify-start">
        {#if activity.asyncData?.asyncStatus && activity?.asyncData?.asyncStatus !== ActivityAsyncStatus.Timelocked}
            <ActivityAsyncStatusPill asyncStatus={activity.asyncData.asyncStatus} />
        {/if}
        {#if isTimelocked}
            <ActivityAsyncStatusPill asyncStatus={ActivityAsyncStatus.Timelocked} />
        {/if}
        {#if activity?.parsedLayer2Metadata}
            <Pill color="blue">
                {localize('pills.smartContract')}
            </Pill>
        {/if}
    </transaction-status>
{/if}
