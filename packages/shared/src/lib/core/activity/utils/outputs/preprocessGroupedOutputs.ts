import { CommonOutput, OutputType } from '@iota/sdk/out/types'
import { OutputResponse, OutputData, UTXOInput } from '@iota/sdk/out/types'
import { IAccountState } from '@core/account/interfaces'
import { IProcessedTransaction } from '@core/activity/types'
import { MILLISECONDS_PER_SECOND } from '@core/utils/constants'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { InclusionState, ActivityDirection } from '../../enums'
import { getSenderAddressFromInputs } from '../getSenderAddressFromInputs'
import { getOutputIdFromTransactionIdAndIndex } from './getOutputIdFromTransactionIdAndIndex'
import { getRecipientAddressFromOutput } from './getRecipientAddressFromOutput'

export function preprocessGroupedOutputs(
    outputDatas: OutputData[],
    transactionInputs: OutputResponse[],
    account: IAccountState
): IProcessedTransaction {
    const transactionMetadata = outputDatas[0]?.metadata
    const wrappedInputs = convertTransactionOutputResponsesToWrappedOutputs(
        transactionMetadata?.transactionId,
        transactionInputs
    )
    const utxoInputs = getUtxoInputsFromWrappedInputs(wrappedInputs)
    const direction = getDirectionForOutputs(outputDatas, wrappedInputs, account.depositAddress)
    const wrappedOutputs = outputDatas.map((outputData) => ({
        outputId: outputData.outputId,
        remainder: outputData.remainder,
        output: outputData.output as CommonOutput,
    }))

    return {
        outputs: wrappedOutputs,
        transactionId: transactionMetadata?.transactionId,
        direction,
        time: new Date(transactionMetadata.milestoneTimestampBooked * MILLISECONDS_PER_SECOND),
        inclusionState: InclusionState.Confirmed,
        utxoInputs,
        wrappedInputs,
    }
}

function getDirectionForOutputs(
    outputs: OutputData[],
    wrappedInputs: IWrappedOutput[],
    accountAddress: string
): ActivityDirection {
    const nonRemainderOutputs = outputs.filter((output) => !output.remainder)
    if (nonRemainderOutputs.length === 0) {
        return ActivityDirection.Outgoing
    }
    const output = nonRemainderOutputs[0].output as CommonOutput
    const recipientAddress = getRecipientAddressFromOutput(output)
    const senderAddress = wrappedInputs ? getSenderAddressFromInputs(wrappedInputs) : ''

    if (recipientAddress === accountAddress && recipientAddress === senderAddress) {
        return ActivityDirection.SelfTransaction
    }
    if (recipientAddress === accountAddress && recipientAddress !== senderAddress) {
        return ActivityDirection.Incoming
    } else {
        return ActivityDirection.Outgoing
    }
}

function convertTransactionOutputResponsesToWrappedOutputs(
    transactionId: string,
    outputResponses: OutputResponse[]
): IWrappedOutput[] {
    return outputResponses.map((outputResponse) =>
        convertTransactionOutputResponseToWrappedOutput(transactionId, outputResponse)
    )
}

function convertTransactionOutputResponseToWrappedOutput(
    transactionId: string,
    outputResponse: OutputResponse
): IWrappedOutput | undefined {
    if (outputResponse.output.type === OutputType.Treasury) {
        return undefined
    } else {
        const outputId = getOutputIdFromTransactionIdAndIndex(transactionId, outputResponse.metadata.outputIndex)
        return { outputId, output: outputResponse.output as CommonOutput, metadata: outputResponse.metadata }
    }
}

function getUtxoInputsFromWrappedInputs(wrappedInputs: IWrappedOutput[]): UTXOInput[] {
    return (
        wrappedInputs?.map(
            (input) =>
                ({
                    type: 0,
                    transactionId: input.metadata?.transactionId,
                    transactionOutputIndex: input.metadata?.outputIndex,
                }) as UTXOInput
        ) ?? []
    )
}
