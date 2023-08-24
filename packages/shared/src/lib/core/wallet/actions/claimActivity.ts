import { handleError } from '@core/error/handlers'
import { getSelectedAccount } from '@core/account/stores'
import {
    isActivityHiddenForAccountIndex,
    removeActivityFromHiddenActivities,
    updateAsyncDataByActivityId,
} from '@core/activity/stores'
import { Activity } from '@core/activity/types'

export async function claimActivity(activity: Activity): Promise<void> {
    const account = getSelectedAccount()

    try {
        if (isActivityHiddenForAccountIndex(account.index, activity.id)) {
            removeActivityFromHiddenActivities(account.index, activity.id)
            updateAsyncDataByActivityId(account.index, activity.id, { isRejected: false })
        }

        updateAsyncDataByActivityId(account.index, activity.id, { isClaiming: true })
        const result = await account.claimOutputs([activity.outputId])
        const transactionId = result.transactionId
        updateAsyncDataByActivityId(account.index, activity.id, { claimingTransactionId: transactionId })
    } catch (err) {
        handleError(err)
        updateAsyncDataByActivityId(account.index, activity.id, { isClaiming: false })
    }
}
