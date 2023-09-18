import { AliasOutput, OutputType } from '@iota/sdk/out/types'
import { IAccountState } from '@core/account'
import { NetworkId } from '@core/network/types'
import { EMPTY_HEX_ID } from '@core/wallet'
import { ActivityAction } from '../enums'
import { Activity, IProcessedTransaction } from '../types'
import { generateSingleAliasActivity } from './generateSingleAliasActivity'

export async function generateActivitiesFromAliasOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState,
    networkId: NetworkId
): Promise<Activity[]> {
    const outputs = processedTransaction.outputs
    const activities = []

    const aliasOutputs = outputs.filter((output) => output.output?.type === OutputType.Alias)
    for (const aliasOutput of aliasOutputs) {
        const output = aliasOutput.output as AliasOutput
        const activity = await generateSingleAliasActivity(account, networkId, {
            action: output.aliasId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send,
            processedTransaction,
            wrappedOutput: aliasOutput,
        })
        activities.push(activity)
    }
    return activities
}
