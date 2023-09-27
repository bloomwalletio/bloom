<script lang="ts">
    import { localize } from '@core/i18n'
    import { ActivityAsyncStatus } from '@core/activity'
    import { Pill } from '@bloomwalletio/ui'

    export let asyncStatus: ActivityAsyncStatus | undefined

    const ASYNC_STATUS_COLOR: { [key in ActivityAsyncStatus]: string } = {
        [ActivityAsyncStatus.Unclaimed]: 'purple',
        [ActivityAsyncStatus.Claimed]: 'blue',
        [ActivityAsyncStatus.Expired]: 'neutral',
        [ActivityAsyncStatus.Timelocked]: 'warning',
    }
</script>

{#if asyncStatus}
    <Pill color={ASYNC_STATUS_COLOR[asyncStatus]} compact>
        {localize('pills.asyncStatus.' + asyncStatus)}
    </Pill>
{/if}
