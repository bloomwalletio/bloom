import { OutputType } from '@iota/sdk/out/types'
import { IAccountState } from '@core/account'
import { ActivityAction, IProcessedTransaction } from '@core/wallet'
import { Activity } from '@core/wallet/types'
import { generateSingleFoundryActivity } from './generateSingleFoundryActivity'

export function generateActivitiesFromFoundryOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): Activity[] {
    const outputs = processedTransaction.outputs
    const activities = []

    const foundryOutputs = outputs.filter((output) => output.output.type === OutputType.Foundry)
    for (const foundryOutput of foundryOutputs) {
        activities.push(
            generateSingleFoundryActivity(account, {
                action: ActivityAction.Mint,
                processedTransaction,
                wrappedOutput: foundryOutput,
            })
        )
    }
    return activities
}
