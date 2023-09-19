<script lang="ts">
    import { localize } from '@core/i18n'
    import { Activity, ActivityAsyncStatus } from '@core/activity'
    import { Pill, Icon, IconName } from '@bloomwalletio/ui'
    import { DefaultColors } from 'tailwindcss/types/generated/colors'
    import { time } from '@core/app/stores'
    import { getTimeDifference } from '@core/utils'

    export let activity: Activity

    const ASYNC_STATUS_COLOR: { [key in ActivityAsyncStatus]: keyof DefaultColors } = {
        [ActivityAsyncStatus.Unclaimed]: 'purple',
        [ActivityAsyncStatus.Claimed]: 'blue',
        [ActivityAsyncStatus.Expired]: 'gray',
        [ActivityAsyncStatus.Timelocked]: 'orange',
    }

    const ASYNC_STATUS_ICON: { [key in ActivityAsyncStatus]: IconName } = {
        [ActivityAsyncStatus.Unclaimed]: IconName.Locked, // TODO: Add icons
        [ActivityAsyncStatus.Claimed]: IconName.Locked,
        [ActivityAsyncStatus.Expired]: IconName.Locked,
        [ActivityAsyncStatus.Timelocked]: IconName.Locked,
    }

    $: text = getText(activity)
    function getText(activity: Activity): string {
        if (!activity.asyncData?.asyncStatus) {
            return ''
        }

        let timeDiff = undefined
        const { asyncStatus, expirationDate, timelockDate } = activity.asyncData
        if (asyncStatus === ActivityAsyncStatus.Timelocked) {
            timeDiff = getTimeDifference(timelockDate, $time)
        }
        if (asyncStatus !== ActivityAsyncStatus.Claimed && expirationDate) {
            timeDiff = getTimeDifference(expirationDate, $time)
        }

        return localize('pills.asyncStatus.' + activity.asyncData?.asyncStatus) + (timeDiff ? ` ${timeDiff}` : '')
    }
</script>

{#if activity.asyncData?.asyncStatus}
    <Pill color={ASYNC_STATUS_COLOR[activity.asyncData.asyncStatus]}>
        <div class="flex flex-row gap-2">
            <Icon name={ASYNC_STATUS_ICON[activity.asyncData.asyncStatus]} size="xs" />
            {text}
        </div>
    </Pill>
{/if}
