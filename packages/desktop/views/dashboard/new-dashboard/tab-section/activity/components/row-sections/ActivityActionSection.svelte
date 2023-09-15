<script lang="ts">
    import { Activity } from '@core/activity'
    import { formatDate } from '@core/i18n'
    import { FontWeight, Text } from '@ui'

    export let activity: Activity
</script>

<Text fontWeight={FontWeight.semibold} classes="text-start">{activity.action}</Text>
<Text fontWeight={FontWeight.semibold} secondary classes="text-start"
    >{formatDate(activity.time, { year: 'numeric', month: 'short', day: 'numeric' })}</Text
>
