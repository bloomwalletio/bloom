<script lang="ts">
    import { ActivityAsyncStatusPill } from '@ui'
    import { Pill } from '@bloomwalletio/ui'
    import { Activity, ActivityAsyncStatus } from '@core/activity'
    import { time } from '@core/app/stores'
    import { localize } from '@core/i18n'

    export let activity: Activity

    $: timelockDate = activity.asyncData?.timelockDate
    $: isTimelocked = timelockDate && timelockDate > $time

    $: hasPills =
        (activity.asyncData?.asyncStatus && activity.asyncData?.asyncStatus !== ActivityAsyncStatus.Timelocked) ||
        isTimelocked ||
        activity.smartContract
</script>

{#if hasPills}
    <transaction-status class="flex flex-row w-full space-x-2 justify-start">
        {#if activity.asyncData?.asyncStatus && activity.asyncData?.asyncStatus !== ActivityAsyncStatus.Timelocked}
            <ActivityAsyncStatusPill asyncStatus={activity.asyncData.asyncStatus} />
        {/if}
        {#if isTimelocked}
            <ActivityAsyncStatusPill asyncStatus={ActivityAsyncStatus.Timelocked} />
        {/if}
        {#if activity.smartContract}
            <Pill color="blue">
                {localize('pills.smartContract')}
            </Pill>
        {/if}
    </transaction-status>
{/if}
