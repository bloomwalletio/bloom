import { get } from 'svelte/store'
import { selectedAccountActivities } from '../stores'
import { StardustActivity } from '../types/stardust/stardust-activity.type'
import { StardustActivityAsyncStatus, ActivityDirection } from '../enums'
import { NetworkNamespace } from '@core/network/enums'

export function getClaimableActivities(): StardustActivity[] {
    return get(selectedAccountActivities).filter((activity) => {
        if (activity.namespace === NetworkNamespace.Evm) {
            return false
        }

        const isTimelocked = activity.asyncData?.asyncStatus === StardustActivityAsyncStatus.Timelocked

        const isActivityIncomingAndUnclaimed =
            activity.asyncData &&
            (activity.direction === ActivityDirection.Incoming ||
                activity.direction === ActivityDirection.SelfTransaction) &&
            activity.asyncData?.asyncStatus === StardustActivityAsyncStatus.Unclaimed

        return !isTimelocked && isActivityIncomingAndUnclaimed
    }) as StardustActivity[]
}
