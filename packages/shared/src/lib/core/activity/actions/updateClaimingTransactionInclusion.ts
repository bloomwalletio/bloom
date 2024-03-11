import { StardustActivityAsyncStatus, StardustActivityType, InclusionState } from '../enums'
import { allAccountActivities } from '../stores'
import { localize } from '@core/i18n'
import { updateActivityFromPartialActivity } from '../utils/helper'
import { addClaimedActivity } from '@core/activity/stores'
import { showNotification } from '@auxiliary/notification/actions'
import { NetworkNamespace } from '@core/network'
import { StardustActivity } from '../types'

export function updateClaimingTransactionInclusion(
    transactionId: string,
    inclusionState: InclusionState,
    accountIndex: number
): void {
    allAccountActivities.update((state) => {
        const activity = state[accountIndex]?.find(
            (_activity) =>
                _activity.namespace === NetworkNamespace.Stardust &&
                _activity.asyncData?.claimingTransactionId === transactionId
        ) as StardustActivity

        if (!activity) {
            return state
        }

        if (inclusionState === InclusionState.Confirmed) {
            updateActivityFromPartialActivity(activity, {
                namespace: NetworkNamespace.Stardust,
                type: StardustActivityType.Basic,
                asyncData: {
                    ...activity.asyncData,
                    isClaiming: false,
                    claimedDate: new Date(),
                    asyncStatus: StardustActivityAsyncStatus.Claimed,
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
                type: StardustActivityType.Basic,
                asyncData: {
                    ...activity.asyncData,
                    isClaiming: false,
                    claimingTransactionId: undefined,
                    asyncStatus: StardustActivityAsyncStatus.Unclaimed,
                },
            })
            showNotification({
                variant: 'error',
                text: localize('notifications.claimed.error'),
            })
        }
        return state
    })
}
