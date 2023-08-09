import { ActivityAsyncStatus, ActivityType, InclusionState } from '../enums'
import { allAccountActivities } from '../stores'
import { localize } from '@core/i18n'
import { updateActivityFromPartialActivity } from '../utils/helper'
import { addClaimedActivity } from '@core/activity/stores'
import { showNotification } from '@auxiliary/notification/actions'

export function updateClaimingTransactionInclusion(
    transactionId: string,
    inclusionState: InclusionState,
    accountIndex: number
): void {
    allAccountActivities.update((state) => {
        const activity = state[accountIndex]?.find(
            (_activity) => _activity.asyncData?.claimingTransactionId === transactionId
        )

        if (activity) {
            if (inclusionState === InclusionState.Confirmed) {
                updateActivityFromPartialActivity(activity, {
                    type: ActivityType.Basic,
                    asyncData: {
                        ...activity.asyncData,
                        isClaiming: false,
                        claimedDate: new Date(),
                        asyncStatus: ActivityAsyncStatus.Claimed,
                    },
                })
                addClaimedActivity(accountIndex, activity?.transactionId, {
                    id: activity.id,
                    claimingTransactionId: transactionId,
                    claimedTimestamp: new Date().getTime(),
                })

                showNotification({
                    variant: 'success',
                    text: localize('notifications.claimed.success'),
                })
            } else if (inclusionState === InclusionState.Conflicting) {
                updateActivityFromPartialActivity(activity, {
                    type: ActivityType.Basic,
                    asyncData: {
                        ...activity.asyncData,
                        isClaiming: false,
                        claimingTransactionId: undefined,
                        asyncStatus: ActivityAsyncStatus.Unclaimed,
                    },
                })
                showNotification({
                    variant: 'error',
                    text: localize('notifications.claimed.error'),
                })
            }
        }
        return state
    })
}
