<script lang="ts">
    import { ActivityAsyncStatusPill } from '@ui'
    import { Pill } from '@bloomwalletio/ui'
    import { localize } from '@core/i18n'
    import { Activity, ActivityAsyncStatus } from '@core/activity'

    export let activity: Activity

    $: hasPills =
        (activity.asyncData?.asyncStatus && activity.asyncData.asyncStatus !== ActivityAsyncStatus.Claimed) ||
        activity.smartContract
</script>

{#if hasPills}
    <transaction-status class="flex flex-row w-full space-x-2 justify-start">
        <ActivityAsyncStatusPill {activity} />
        {#if activity.smartContract}
            <Pill color="blue">
                {localize('general.smartContract')}
            </Pill>
        {/if}
    </transaction-status>
{/if}
