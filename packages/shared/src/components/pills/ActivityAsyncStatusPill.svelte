<script lang="ts">
    import { DefaultColors } from 'tailwindcss/types/generated/colors'
    import { Pill } from '@bloomwalletio/ui'
    import { ActivityAsyncStatus } from '@core/activity'
    import { localize } from '@core/i18n'

    export let asyncStatus: ActivityAsyncStatus

    const ASYNC_STATUS_COLOR: { [key in ActivityAsyncStatus]: keyof DefaultColors } = {
        [ActivityAsyncStatus.Unclaimed]: 'purple',
        [ActivityAsyncStatus.Claimed]: 'blue',
        [ActivityAsyncStatus.Expired]: 'gray',
        [ActivityAsyncStatus.Timelocked]: 'orange',
    }
</script>

{#if asyncStatus}
    <Pill color={ASYNC_STATUS_COLOR[asyncStatus]}>
        {localize('pills.asyncStatus.' + asyncStatus)}
    </Pill>
{/if}
