import { get } from 'svelte/store'
import { selectedAccountActivities } from '../stores'
import { Activity } from '../types/activity.type'
import { ActivityAsyncStatus, ActivityDirection } from '../enums'

export function getClaimableActivities(): Activity[] {
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
