import { IAccountState } from '@core/account'
import { EMPTY_HEX_ID } from '@core/wallet'
import { Activity, IProcessedTransaction } from '../types'
import { OutputType, NftOutput } from '@iota/sdk/out/types'
import { generateSingleNftActivity } from './generateSingleNftActivity'
import { ActivityAction } from '../enums'

export function generateActivitiesFromNftOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): Activity[] {
    const outputs = processedTransaction.outputs
    const activities = []

    const nftOutputs = outputs.filter((output) => output.output.type === OutputType.Nft)
    for (const nftOutput of nftOutputs) {
        const output = nftOutput.output as NftOutput
        activities.push(
            generateSingleNftActivity(account, {
                action: output.nftId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send,
                processedTransaction,
                wrappedOutput: nftOutput,
            })
        )
    }
    return activities
}
