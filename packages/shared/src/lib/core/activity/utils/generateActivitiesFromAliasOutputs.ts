import { IAccountState } from '@core/account'
import { EMPTY_HEX_ID, OUTPUT_TYPE_ALIAS } from '@core/wallet'
import { Activity, IProcessedTransaction } from '../types'
import type { IAliasOutput } from '@iota/types'
import { generateSingleAliasActivity } from './generateSingleAliasActivity'
import { ActivityAction } from '../enums'
import { NetworkId } from '@core/network/types'

export async function generateActivitiesFromAliasOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState,
    networkId: NetworkId
): Promise<Activity[]> {
    const outputs = processedTransaction.outputs
    const activities = []

    const aliasOutputs = outputs.filter((output) => output.output.type === OUTPUT_TYPE_ALIAS)
    for (const aliasOutput of aliasOutputs) {
        const output = aliasOutput.output as IAliasOutput
        const activity = await generateSingleAliasActivity(account, networkId, {
            action: output.aliasId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send,
            processedTransaction,
            wrappedOutput: aliasOutput,
        })
        activities.push(activity)
    }
    return activities
}
