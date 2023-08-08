import { IAccountState } from '@core/account'
import { IProcessedTransaction, OUTPUT_TYPE_FOUNDRY } from '@core/wallet'
import { Activity } from '../types'
import { generateSingleFoundryActivity } from './generateSingleFoundryActivity'
import { ActivityAction } from '../enums'

export function generateActivitiesFromFoundryOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): Activity[] {
    const outputs = processedTransaction.outputs
    const activities = []

    const foundryOutputs = outputs.filter((output) => output.output.type === OUTPUT_TYPE_FOUNDRY)
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
