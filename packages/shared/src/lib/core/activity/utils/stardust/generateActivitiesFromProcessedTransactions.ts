import { IAccountState } from '@core/account'
import { StardustActivity, IProcessedTransaction } from '../../types'
import { StardustNetworkId } from '@core/network/types'
import { generateActivitiesFromStardustNetwork } from './generateActivitiesFromStardustNetwork'

export async function generateActivitiesFromProcessedTransactions(
    processedTransactions: IProcessedTransaction[],
    account: IAccountState,
    networkId: StardustNetworkId
): Promise<StardustActivity[]> {
    const activities: StardustActivity[] = []
    for (const _preparedActivity of processedTransactions) {
        try {
            const activitiesToAdd = await generateActivitiesFromStardustNetwork(_preparedActivity, account, networkId)
            activities.push(...activitiesToAdd)
        } catch (err) {
            console.error(err)
        }
    }
    return activities
}
