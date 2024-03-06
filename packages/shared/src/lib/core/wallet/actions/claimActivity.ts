import { handleError } from '@core/error/handlers'
import { removeActivityFromHiddenActivities, updateAsyncDataByActivityId } from '@core/activity/stores'
import { StardustActivity } from '@core/activity/types'
import { IAccountState } from '@core/account'

export async function claimActivity(activity: StardustActivity, account: IAccountState): Promise<void> {
    try {
        removeActivityFromHiddenActivities(account.index, activity.id)
        updateAsyncDataByActivityId(account.index, activity.id, { isClaiming: true, isRejected: false })

        const result = await account.claimOutputs([activity.outputId])
        const transactionId = result.transactionId
        updateAsyncDataByActivityId(account.index, activity.id, { claimingTransactionId: transactionId })
    } catch (err) {
        handleError(err)
        updateAsyncDataByActivityId(account.index, activity.id, { isClaiming: false })
    }
}
