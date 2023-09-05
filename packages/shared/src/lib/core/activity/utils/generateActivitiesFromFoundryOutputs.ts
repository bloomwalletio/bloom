import { IAccountState } from '@core/account'
import { OUTPUT_TYPE_FOUNDRY } from '@core/wallet'
import { Activity, IProcessedTransaction } from '../types'
import { generateSingleFoundryActivity } from './generateSingleFoundryActivity'
import { ActivityAction } from '../enums'
import { NetworkId } from '@core/network/types'

export async function generateActivitiesFromFoundryOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState,
    networkId: NetworkId
): Promise<Activity[]> {
    const outputs = processedTransaction.outputs
    const activities = []

    const foundryOutputs = outputs.filter((output) => output.output.type === OUTPUT_TYPE_FOUNDRY)
    for (const foundryOutput of foundryOutputs) {
        const activity = await generateSingleFoundryActivity(account, networkId, {
            action: ActivityAction.Mint,
            processedTransaction,
            wrappedOutput: foundryOutput,
        })
        activities.push(activity)
    }
    return activities
}
