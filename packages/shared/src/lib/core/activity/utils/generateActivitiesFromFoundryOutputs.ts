import { OutputType } from '@iota/sdk/out/types'
import { IAccountState } from '@core/account'
import { NetworkId } from '@core/network/types'
import { ActivityAction } from '../enums'
import { Activity, IProcessedTransaction } from '../types'
import { generateSingleFoundryActivity } from './generateSingleFoundryActivity'

export async function generateActivitiesFromFoundryOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState,
    networkId: NetworkId
): Promise<Activity[]> {
    const outputs = processedTransaction.outputs
    const activities = []

    const foundryOutputs = outputs.filter((output) => output.output?.type === OutputType.Foundry)
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
