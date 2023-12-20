import { CommonOutput, OutputData } from '@iota/sdk/out/types'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { ActivityDirection } from '../enums'
import { getRecipientAddressFromOutput } from './outputs'
import { EMPTY_HEX_ID } from '@core/wallet'

export function getDirectionFromTransaction(
    wrappedOutputs: IWrappedOutput[],
    incoming: boolean,
    accountAddress: string,
    inputs: OutputData[]
): ActivityDirection {
    const isGenesis =
        inputs.length === 0 && wrappedOutputs.some((outputData) => outputData.metadata?.blockId === EMPTY_HEX_ID)
    if (isGenesis) {
        return ActivityDirection.Incoming
    }
    const containsOutput = wrappedOutputs.some((outputData) => {
        const recipientAddress = getRecipientAddressFromOutput(outputData.output as CommonOutput)

        outputData.metadata?.blockId

        if (incoming) {
            return accountAddress === recipientAddress
        } else {
            return accountAddress !== recipientAddress
        }
    })
    if (containsOutput) {
        return incoming ? ActivityDirection.Incoming : ActivityDirection.Outgoing
    } else {
        const isSelfTransaction = wrappedOutputs.some(
            (outputData) => accountAddress === getRecipientAddressFromOutput(outputData.output as CommonOutput)
        )
        return isSelfTransaction ? ActivityDirection.SelfTransaction : ActivityDirection.Incoming
    }
}
