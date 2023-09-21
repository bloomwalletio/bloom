<script lang="ts">
    import { Activity } from '@core/activity'
    import { ActivityAsyncStatusPill } from '@ui'

    export let activity: Activity
</script>

<div>
    <ActivityAsyncStatusPill asyncStatus={activity.asyncData?.asyncStatus} />
</div>
