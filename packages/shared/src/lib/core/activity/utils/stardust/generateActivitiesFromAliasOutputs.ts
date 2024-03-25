import { AliasOutput, OutputType } from '@iota/sdk/out/types'
import { IAccountState } from '@core/account'
import { EMPTY_HEX_ID } from '@core/wallet'
import { StardustActivity, IProcessedTransaction } from '../../types'
import { generateSingleAliasActivity } from './generateSingleAliasActivity'
import { ActivityAction } from '../../enums'
import { NetworkId } from '@core/network/types'

export async function generateActivitiesFromAliasOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState,
    networkId: NetworkId
): Promise<StardustActivity[]> {
    const outputs = processedTransaction.outputs
    const activities: StardustActivity[] = []

    const aliasOutputs = outputs.filter((output) => output.output?.type === OutputType.Alias)
    for (const aliasOutput of aliasOutputs) {
        try {
            const output = aliasOutput.output as AliasOutput
            const activity = await generateSingleAliasActivity(account, networkId, {
                action: output.aliasId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send,
                processedTransaction,
                wrappedOutput: aliasOutput,
            })
            activities.push(activity)
        } catch (error) {
            console.error(error)
        }
    }
    return activities
}
