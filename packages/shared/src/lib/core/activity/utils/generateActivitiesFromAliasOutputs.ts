import { AliasOutput, OutputType } from '@iota/sdk/out/types'
import { IAccountState } from '@core/account'
import { EMPTY_HEX_ID } from '@core/wallet'
import { Activity, IProcessedTransaction } from '../types'
import { generateSingleAliasActivity } from './generateSingleAliasActivity'
import { ActivityAction } from '../enums'

export function generateActivitiesFromAliasOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): Activity[] {
    const outputs = processedTransaction.outputs
    const activities = []

    const aliasOutputs = outputs.filter((output) => output.output.type === OutputType.Alias)
    for (const aliasOutput of aliasOutputs) {
        const output = aliasOutput.output as AliasOutput
        activities.push(
            generateSingleAliasActivity(account, {
                action: output.aliasId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send,
                processedTransaction,
                wrappedOutput: aliasOutput,
            })
        )
    }
    return activities
}
