<script lang="ts">
    import { ActivityAsyncStatusPill, Pill } from '@ui'
    import { localize } from '@core/i18n'
    import { time } from '@core/app'
    import { Activity, ActivityAsyncStatus } from '@core/activity'

    export let activity: Activity

    $: isTimelocked = activity.asyncData?.timelockDate > $time

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
            <Pill backgroundColor="gray-200" darkBackgroundColor="gray-200">
                {localize('pills.locked')}
            </Pill>
        {/if}
        {#if activity?.parsedLayer2Metadata}
            <Pill backgroundColor="blue-200" darkBackgroundColor="blue-200">
                {localize('pills.smartContract')}
            </Pill>
        {/if}
    </transaction-status>
{/if}
