import { IAccountState } from '@core/account'
import { Activity, IProcessedTransaction } from '../types'
import { generateActivities } from '../utils'
import { NetworkId } from '@core/network/types'

export async function generateActivitiesFromProcessedTransactions(
    processedTransactions: IProcessedTransaction[],
    account: IAccountState,
    networkId: NetworkId
): Promise<Activity[]> {
    const activities: Activity[] = []
    for (const _preparedActivity of processedTransactions) {
        try {
            const activitiesToAdd = await generateActivities(_preparedActivity, account, networkId)
            activities.push(...activitiesToAdd)
        } catch (err) {
            console.error(err)
        }
    }
    return activities
}
