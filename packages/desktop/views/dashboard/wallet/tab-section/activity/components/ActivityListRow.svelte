<script lang="ts">
    import { Activity } from '@core/activity'
    import { NotVerifiedStatus } from '@core/token'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import {
        ActivityActionSection,
        ActivityAssetSection,
        ActivityAmountSection,
        ActivityAddressSection,
        ActivityStatusSection,
    } from './row-sections'
    import { getTokenFromActivity } from '@core/activity/utils/getTokenFromActivity'

    export let activity: Activity

    function onActivityClick(): void {
        const token = getTokenFromActivity(activity)
        if (token?.verification?.status === NotVerifiedStatus.New) {
            openPopup({
                id: PopupId.TokenInformation,
                overflow: true,
                props: {
                    activityId: activity.id,
                    token,
                },
            })
        } else {
            openPopup({
                id: PopupId.ActivityDetails,
                props: { activityId: activity.id },
            })
        }
    }
</script>

<button on:click={onActivityClick} class="activity-row">
    <ActivityAssetSection {activity} />
    <ActivityStatusSection {activity} />
    <ActivityActionSection {activity} />
    <ActivityAddressSection {activity} />
    <ActivityAmountSection {activity} />
</button>

<style lang="scss">
    .activity-row {
        @apply w-full;
        @apply px-5 py-4;
        @apply border-b border-solid border-stroke dark:border-stroke-dark;
        @apply hover:bg-surface-2 hover:dark:border-surface-2-dark;

        @apply grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
</style>
