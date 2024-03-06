<script lang="ts">
    import { StardustActivity } from '@core/activity'
    import { formatDate } from '@core/i18n'
    import { Text } from '@bloomwalletio/ui'

    export let activity: StardustActivity
</script>

<div class="text-start">
    <Text>{formatDate(activity.time, { year: 'numeric', month: 'short', day: 'numeric' })}</Text>
    <Text textColor="secondary"
        >{formatDate(activity.time, { hour: 'numeric', minute: 'numeric', second: 'numeric' })}</Text
    >
</div>
