<script lang="ts">
    import { localize } from '@core/i18n'
    import { Activity, ActivityAsyncStatus, ActivityDirection, AsyncData } from '@core/activity'
    import { Pill, Icon, IconName } from '@bloomwalletio/ui'
    import { getTimeDifference } from '@core/utils/time'
    import { time } from '@core/app/stores'

    export let activity: Activity

    let timeDiff: string | undefined = undefined
    $: $time, (timeDiff = getTimeDiff(activity.asyncData))

    let pillStyle: { color: string; icon: IconName; text: string } | undefined
    $: timeDiff, activity, (pillStyle = getPillStyle())

    function getPillStyle(): { color: string; icon: IconName; text: string } | undefined {
        if (!activity.asyncData?.asyncStatus) {
            return undefined
        }

        switch (activity.asyncData.asyncStatus) {
            case ActivityAsyncStatus.Claimed:
                return undefined
            case ActivityAsyncStatus.Timelocked:
                if (activity.direction === ActivityDirection.Outgoing) {
                    return undefined
                } else {
                    return {
                        color: 'neutral',
                        icon: IconName.Locked,
                        text: localize('pills.asyncStatus.timelocked', { timeDiff }),
                    }
                }
            case ActivityAsyncStatus.Unclaimed:
                if (activity.direction === ActivityDirection.Outgoing) {
                    return {
                        color: 'warning',
                        icon: IconName.Hourglass,
                        text: localize('pills.asyncStatus.unclaimed', { timeDiff }),
                    }
                } else {
                    return {
                        color: 'warning',
                        icon: IconName.Hourglass,
                        text: localize('pills.asyncStatus.claim', { timeDiff }),
                    }
                }
            case ActivityAsyncStatus.Expired:
                return {
                    color: 'neutral',
                    icon: IconName.ClockPlus,
                    // icon: IconName.EmptyHourglass,
                    text: localize('pills.asyncStatus.expired'),
                }
            default:
                return undefined
        }
    }

    function getTimeDiff(asyncData: AsyncData | undefined): string | undefined {
        if (!asyncData) {
            return undefined
        }

        const { asyncStatus, expirationDate, timelockDate } = asyncData
        if (asyncStatus === ActivityAsyncStatus.Timelocked) {
            return getTimeDifference(timelockDate, $time)
        }
        if (asyncStatus !== ActivityAsyncStatus.Claimed && expirationDate) {
            return getTimeDifference(expirationDate, $time)
        }
    }
</script>

{#if pillStyle}
    <Pill color={pillStyle.color} compact>
        <div class="flex flex-row items-center gap-2">
            <Icon name={pillStyle.icon} size="xxs" customColor={pillStyle.color} />
            {pillStyle.text}
        </div>
    </Pill>
{/if}
