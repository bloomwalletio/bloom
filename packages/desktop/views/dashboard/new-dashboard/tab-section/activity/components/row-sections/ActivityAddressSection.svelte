<script lang="ts">
    import { Activity } from '@core/activity'
    import { FontWeight, Text } from '@ui'

    export let activity: Activity
</script>

<Text fontWeight={FontWeight.semibold} classes="text-start">{activity.sender}</Text>
<Text fontWeight={FontWeight.semibold} secondary classes="text-start">{activity.recipient}</Text>
