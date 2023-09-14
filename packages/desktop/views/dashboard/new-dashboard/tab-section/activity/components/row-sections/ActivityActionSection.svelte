<script lang="ts">
    import { Activity } from '@core/activity'
    import { getFormattedTimeStamp } from '@core/i18n/utils'
    import { FontWeight, Text } from '@ui'

    export let activity: Activity
</script>

<Text fontWeight={FontWeight.semibold} classes="text-start">{activity.action}</Text>
<Text fontWeight={FontWeight.semibold} secondary classes="text-start">{getFormattedTimeStamp(activity.time)}</Text>
