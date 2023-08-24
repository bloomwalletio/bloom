import { IAccountState } from '@core/account'
import { OUTPUT_TYPE_FOUNDRY } from '@core/wallet'
import { Activity, IProcessedTransaction } from '../types'
import { generateSingleFoundryActivity } from './generateSingleFoundryActivity'
import { ActivityAction } from '../enums'
import { NetworkId } from '@core/network/types'

export function generateActivitiesFromFoundryOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState,
    networkId: NetworkId
): Activity[] {
    const outputs = processedTransaction.outputs
    const activities = []

    const foundryOutputs = outputs.filter((output) => output.output.type === OUTPUT_TYPE_FOUNDRY)
    for (const foundryOutput of foundryOutputs) {
        activities.push(
            generateSingleFoundryActivity(account, networkId, {
                action: ActivityAction.Mint,
                processedTransaction,
                wrappedOutput: foundryOutput,
            })
        )
    }
    return activities
}
