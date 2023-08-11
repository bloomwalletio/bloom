import { IAccountState } from '@core/account'
import { Activity, IProcessedTransaction } from '../types'
import { generateActivities } from '../utils'
import { NetworkIdType } from '@core/network/types'

export function generateActivitiesFromProcessedTransactions(
    processedTransactions: IProcessedTransaction[],
    account: IAccountState,
    networkId: NetworkIdType
): Activity[] {
    const activities: Activity[] = []
    for (const _preparedActivity of processedTransactions) {
        try {
            const activitiesToAdd = generateActivities(_preparedActivity, account, networkId)
            activities.push(...activitiesToAdd)
        } catch (err) {
            console.error(err)
        }
    }
    return activities
}
