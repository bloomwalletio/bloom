import { IAccountState } from '@core/account'
import { EMPTY_HEX_ID } from '@core/wallet'
import { Activity, IProcessedTransaction } from '../types'
import { OutputType, NftOutput } from '@iota/sdk/out/types'
import { generateSingleNftActivity } from './generateSingleNftActivity'
import { ActivityAction } from '../enums'
import { NetworkId } from '@core/network/types'

export async function generateActivitiesFromNftOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState,
    networkId: NetworkId
): Promise<Activity[]> {
    const outputs = processedTransaction.outputs
    const activities = []

    const nftOutputs = outputs.filter((output) => output.output?.type === OutputType.Nft)
    for (const nftOutput of nftOutputs) {
        const output = nftOutput.output as NftOutput
        const activity = await generateSingleNftActivity(account, networkId, {
            action: output.nftId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send,
            processedTransaction,
            wrappedOutput: nftOutput,
        })
        activities.push(activity)
    }
    return activities
}
