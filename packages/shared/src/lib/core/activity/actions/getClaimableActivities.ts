import { get } from 'svelte/store'
import { selectedAccountActivities } from '../stores'
import { StardustActivity } from '../types/stardust/stardust-activity.type'
import { ActivityAsyncStatus, ActivityDirection } from '../enums'

export function getClaimableActivities(): StardustActivity[] {
    return get(selectedAccountActivities).filter((activity) => {
        const isTimelocked = activity.asyncData?.asyncStatus === ActivityAsyncStatus.Timelocked

        const isActivityIncomingAndUnclaimed =
            activity.asyncData &&
            (activity.direction === ActivityDirection.Incoming ||
                activity.direction === ActivityDirection.SelfTransaction) &&
            activity.asyncData?.asyncStatus === ActivityAsyncStatus.Unclaimed

        return !isTimelocked && isActivityIncomingAndUnclaimed
    })
}
