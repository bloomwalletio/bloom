import { OutputType, NftOutput } from '@iota/sdk/out/types'
import { IAccountState } from '@core/account'
import { NetworkId } from '@core/network/types'
import { EMPTY_HEX_ID } from '@core/wallet'
import { ActivityAction } from '../enums'
import { Activity, IProcessedTransaction } from '../types'
import { generateSingleNftActivity } from './generateSingleNftActivity'

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
