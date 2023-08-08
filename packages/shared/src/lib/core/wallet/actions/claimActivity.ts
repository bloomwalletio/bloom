import { get } from 'svelte/store'
import { selectedAccount } from '@core/account/stores'
import { handleError } from '@core/error/handlers'

import { updateAsyncDataByActivityId } from '../stores'
import { Activity } from '../types'
import { isActivityHiddenForAccountIndex, removeActivityFromHiddenActivities } from '@core/activities/stores'

export async function claimActivity(activity: Activity): Promise<void> {
    const account = get(selectedAccount)
    if (!account) {
        return
    }
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
