<script lang="ts">
    import { localize } from '@core/i18n'
    import { StardustActivity, StardustActivityAsyncStatus, ActivityDirection } from '@core/activity'
    import { Pill, Icon, IconName } from '@bloomwalletio/ui'
    import { getTimeDifference } from '@core/utils/time'
    import { time } from '@core/app/stores'

    export let activity: StardustActivity

    let pillProps: { color: string; icon: IconName; text: string } | undefined
    $: $time, activity, (pillProps = getPillStyle())

    function getPillStyle(): { color: string; icon: IconName; text: string } | undefined {
        if (!activity.asyncData?.asyncStatus) {
            return undefined
        }
        const { asyncStatus, expirationDate, timelockDate } = activity.asyncData

        switch (asyncStatus) {
            case StardustActivityAsyncStatus.Claimed: {
                return undefined
            }
            case StardustActivityAsyncStatus.Timelocked: {
                if (activity.direction === ActivityDirection.Outgoing) {
                    if (expirationDate) {
                        return {
                            color: 'warning',
                            icon: IconName.Hourglass,
                            text: localize('pills.asyncStatus.unclaimed', {
                                timeDiff: getTimeDifference(expirationDate, $time),
                            }),
                        }
                    } else {
                        return undefined
                    }
                } else {
                    return {
                        color: 'neutral',
                        icon: IconName.Locked,
                        text: localize('pills.asyncStatus.timelocked', {
                            timeDiff: getTimeDifference(timelockDate, $time),
                        }),
                    }
                }
            }
            case StardustActivityAsyncStatus.Unclaimed: {
                const timeDiff = expirationDate ? getTimeDifference(expirationDate, $time) : undefined
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
            }
            case StardustActivityAsyncStatus.Expired: {
                return {
                    color: 'neutral',
                    icon: IconName.EmptyHourglass,
                    text: localize('pills.asyncStatus.expired'),
                }
            }
            default: {
                return undefined
            }
        }
    }
</script>

{#if pillProps}
    <div class="flex flex-col w-1/2 items-center justify-center">
        <Pill color={pillProps.color} compact>
            <div class="flex flex-row items-center gap-1">
                <Icon name={pillProps.icon} size="xxs" customColor={pillProps.color} />
                {pillProps.text}
            </div>
        </Pill>
    </div>
{/if}
