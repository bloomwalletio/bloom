<script lang="ts">
    import { StardustActivity, StardustActivityAsyncStatus } from '@core/activity'
    import { getTokenFromActivity } from '@core/activity/utils/getTokenFromActivity'
    import { NotVerifiedStatus } from '@core/token'
    import { PopupId, openPopup } from '@desktop/auxiliary/popup'
    import {
        ActivityAddressSection,
        ActivityAmountSection,
        ActivityAssetSection,
        ActivityDateSection,
        ActivityFeeSection,
    } from './row-sections'

    export let activity: StardustActivity

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

<button
    on:click={onActivityClick}
    class="activity-row"
    class:expired={activity.asyncData?.asyncStatus === StardustActivityAsyncStatus.Expired}
>
    <ActivityAssetSection {activity} />
    <ActivityDateSection {activity} />
    <ActivityAddressSection {activity} />
    <ActivityAmountSection {activity} />
    <ActivityFeeSection {activity} />
</button>

<style lang="postcss">
    .activity-row {
        @apply w-full items-center justify-center;
        @apply px-5 py-3.5;
        @apply border-b border-solid border-stroke dark:border-stroke-dark;
        @apply hover:bg-surface-2 dark:hover:bg-surface-2-dark;

        @apply grid gap-8;
        grid-template-columns: 3fr 1fr 2fr 2fr 1fr;

        &.expired {
            opacity: 0.5;
        }
    }
</style>
