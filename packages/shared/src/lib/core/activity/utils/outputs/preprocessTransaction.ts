import { IProcessedTransaction } from '../../types'
import { Output, OutputType, Transaction } from '@iota/sdk/out/types'
import { getOutputIdFromTransactionIdAndIndex } from './getOutputIdFromTransactionIdAndIndex'
import { IAccountState } from '@core/account'
import { getDirectionFromTransaction } from '../getDirectionFromTransaction'
import { IWrappedOutput } from '@core/wallet/interfaces'

export async function preprocessTransaction(
    transaction: Transaction,
    account: IAccountState
): Promise<IProcessedTransaction> {
    const outputs = convertTransactionsOutputTypesToWrappedOutputs(
        transaction?.transactionId,
        transaction.payload.essence.outputs
    )
    const direction = getDirectionFromTransaction(outputs, transaction.incoming, account.depositAddress)
    const utxoInputs = transaction.payload.essence.inputs
    const inputIds = utxoInputs.map((input) =>
        getOutputIdFromTransactionIdAndIndex(input?.transactionId, input.transactionOutputIndex)
    )
    const inputs = await Promise.all(inputIds.map((inputId) => account.getOutput(inputId)))
    return {
        outputs: outputs,
        transactionId: transaction?.transactionId,
        direction,
        time: new Date(Number(transaction.timestamp)),
        inclusionState: transaction.inclusionState,
        wrappedInputs: <IWrappedOutput[]>inputs,
        utxoInputs,
    }
}

function convertTransactionsOutputTypesToWrappedOutputs(transactionId: string, outputs: Output[]): IWrappedOutput[] {
    return outputs.map((outputType, index) =>
        convertTransactionOutputTypeToWrappedOutput(transactionId, index, outputType)
    )
}

function convertTransactionOutputTypeToWrappedOutput(
    transactionId: string,
    index: number,
    output: Output
): IWrappedOutput {
    const outputId = getOutputIdFromTransactionIdAndIndex(transactionId, index)
    return {
        outputId,
        output: output.type !== OutputType.Foundry ? output : undefined,
        remainder: false,
    }
}
