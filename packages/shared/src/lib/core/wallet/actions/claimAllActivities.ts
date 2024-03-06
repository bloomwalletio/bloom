import { handleError } from '@core/error/handlers'
import { removeActivitiesFromHiddenActivities, updateAsyncDataByActivityIds } from '@core/activity/stores'
import { StardustActivity } from '@core/activity/types'
import { IAccountState } from '@core/account'

export async function claimAllActivities(activities: StardustActivity[], account: IAccountState): Promise<void> {
    const activityIds = activities.map((activity) => activity.id)
    try {
        removeActivitiesFromHiddenActivities(account.index, activityIds)
        updateAsyncDataByActivityIds(account.index, activityIds, { isClaiming: true, isRejected: false })

        const outputIds = activities.map((activity) => activity.outputId).filter(Boolean) as string[]
        const result = await account.claimOutputs(outputIds)
        const transactionId = result.transactionId

        updateAsyncDataByActivityIds(account.index, activityIds, { claimingTransactionId: transactionId })
    } catch (err) {
        handleError(err)
        updateAsyncDataByActivityIds(account.index, activityIds, { isClaiming: false })
    }
}
