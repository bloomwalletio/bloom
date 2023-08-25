<script lang="ts">
    import { Activity, ActivityAsyncStatus } from '@core/activity'
    import { time } from '@core/app/stores'
    import { localize } from '@core/i18n'
    import { getTimeDifference } from '@core/utils'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import { ActivityAsyncStatusPill, FontWeight, Text, TileFooter, TooltipIcon } from '@ui'
    import { Position } from '@ui/enums'

    export let activity: Activity

    $: timeDiff = getTimeDiff(activity)

    function getTimeDiff(_activity: Activity): string {
        let timeDiff: string | undefined = undefined
        if (_activity.asyncData?.asyncStatus === ActivityAsyncStatus.Timelocked) {
            timeDiff = getTimeDifference(_activity.asyncData?.timelockDate, $time)
        }
        return timeDiff ? timeDiff : localize('general.none')
    }
</script>

<TileFooter>
    <svelte:fragment slot="left">
        <TooltipIcon
            icon={IconEnum.Timelock}
            iconClasses="text-gray-600 dark:text-gray-200"
            title={localize('general.timelockDate')}
            text={localize(`tooltips.transactionDetails.${activity.direction}.timelockDate`)}
            position={Position.Top}
        />
        <Text fontSize="13" color="gray-600" fontWeight={FontWeight.semibold}>{timeDiff}</Text>
    </svelte:fragment>

    <ActivityAsyncStatusPill slot="right" asyncStatus={ActivityAsyncStatus.Timelocked} />
</TileFooter>
