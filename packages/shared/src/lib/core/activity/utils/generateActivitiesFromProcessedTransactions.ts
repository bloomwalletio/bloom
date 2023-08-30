import { IAccountState } from '@core/account'
import { Activity, IProcessedTransaction } from '../types'
import { generateActivities } from '.'
import { NetworkId } from '@core/network/types'

export function generateActivitiesFromProcessedTransactions(
    processedTransactions: IProcessedTransaction[],
    account: IAccountState,
    networkId: NetworkId
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
