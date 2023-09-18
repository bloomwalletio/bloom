<script lang="ts">
    import { FontWeight, Text } from '@ui'
    import { Activity } from '@core/activity'
    import { formatDate } from '@core/i18n'

    export let activity: Activity
</script>

<Text fontWeight={FontWeight.semibold} classes="text-start">{activity.action}</Text>
<Text fontWeight={FontWeight.semibold} secondary classes="text-start"
    >{formatDate(activity.time, { year: 'numeric', month: 'short', day: 'numeric' })}</Text
>
