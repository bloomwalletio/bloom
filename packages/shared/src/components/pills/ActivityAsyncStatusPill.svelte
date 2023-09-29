<script lang="ts">
    import { localize } from '@core/i18n'
    import { Activity, ActivityAsyncStatus } from '@core/activity'
    import { Pill, Icon, IconName } from '@bloomwalletio/ui'
    import { getTimeDifference } from '@core/utils/time'
    import { time } from '@core/app/stores'

    export let activity: Activity

    $: timeDiff = getTimeDiff(activity)
    $: pillStyle = activity.asyncData?.asyncStatus ? PILL_STYLE[activity.asyncData?.asyncStatus] : undefined

    const PILL_STYLE: { [key in ActivityAsyncStatus]: { color: string; icon: IconName } } = {
        [ActivityAsyncStatus.Unclaimed]: {
            color: 'warning',
            icon: IconName.ClockPlus,
        },
        [ActivityAsyncStatus.Claimed]: {
            color: 'blue',
            icon: IconName.Check,
        },
        [ActivityAsyncStatus.Expired]: {
            color: 'neutral',
            icon: IconName.ClockPlus,
        },
        [ActivityAsyncStatus.Timelocked]: {
            color: 'neutral',
            icon: IconName.Locked,
        },
    }

    function getTimeDiff(activity: Activity): string | undefined {
        if (activity.asyncData) {
            const { asyncStatus, expirationDate, timelockDate } = activity.asyncData
            if (asyncStatus === ActivityAsyncStatus.Timelocked) {
                return getTimeDifference(timelockDate, $time)
            }
            if (asyncStatus !== ActivityAsyncStatus.Claimed && expirationDate) {
                return getTimeDifference(expirationDate, $time)
            }
        }
        return undefined
    }
</script>

{#if pillStyle}
    <Pill color={pillStyle.color} compact>
        <div class="flex flex-row items-center gap-2">
            <Icon name={pillStyle.icon} size="xxs" customColor={pillStyle.color} />
            {localize('pills.asyncStatus.' + activity.asyncData?.asyncStatus) + (timeDiff ? ` ${timeDiff}` : '')}
        </div>
    </Pill>
{/if}
