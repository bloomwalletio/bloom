import { OutputType } from '@iota/sdk/out/types'
import { IAccountState } from '@core/account'
import { StardustActivity, IProcessedTransaction } from '../../types'
import { generateSingleFoundryActivity } from './generateSingleFoundryActivity'
import { ActivityAction } from '../../enums'
import { NetworkId } from '@core/network/types'

export async function generateActivitiesFromFoundryOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState,
    networkId: NetworkId
): Promise<StardustActivity[]> {
    const outputs = processedTransaction.outputs
    const activities: StardustActivity[] = []

    const foundryOutputs = outputs.filter((output) => output.output?.type === OutputType.Foundry)
    for (const foundryOutput of foundryOutputs) {
        try {
            const activity = await generateSingleFoundryActivity(account, networkId, {
                action: ActivityAction.Mint,
                processedTransaction,
                wrappedOutput: foundryOutput,
            })
            activities.push(activity)
        } catch (error) {
            console.error(error)
        }
    }
    return activities
}
