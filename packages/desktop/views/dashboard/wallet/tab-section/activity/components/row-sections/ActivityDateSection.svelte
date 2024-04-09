<script lang="ts">
    import { Activity } from '@core/activity'
    import { formatDate } from '@core/i18n'
    import { Text } from '@bloomwalletio/ui'

    export let activity: Activity
</script>

<div class="text-start">
    <Text>{formatDate(activity.time, { year: 'numeric', month: 'short', day: 'numeric' })}</Text>
    <Text textColor="secondary"
        >{formatDate(activity.time, { hour: 'numeric', minute: 'numeric', second: 'numeric' })}</Text
    >
</div>
