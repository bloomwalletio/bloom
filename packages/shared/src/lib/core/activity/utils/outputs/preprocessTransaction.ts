import { IProcessedTransaction } from '../../types'
import { OutputType, RegularTransactionEssence, Transaction, UTXOInput } from '@iota/sdk/out/types'
import { getOutputIdFromTransactionIdAndIndex } from './getOutputIdFromTransactionIdAndIndex'
import { IAccountState } from '@core/account'
import { getDirectionFromTransaction } from '../getDirectionFromTransaction'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { Output } from '@core/wallet/types'

export async function preprocessTransaction(
    transaction: Transaction,
    account: IAccountState
): Promise<IProcessedTransaction> {
    const transactionEssence = transaction.payload.essence as RegularTransactionEssence
    const outputs = convertTransactionsOutputTypesToWrappedOutputs(
        transaction?.transactionId,
        transactionEssence.outputs as Output[]
    )
    const direction = getDirectionFromTransaction(outputs, transaction.incoming, account.depositAddress)
    const utxoInputs = transactionEssence.inputs as UTXOInput[]
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
    return outputs
        .map((outputType, index) => convertTransactionOutputTypeToWrappedOutput(transactionId, index, outputType))
        .filter((o) => !!o) as IWrappedOutput[]
}

function convertTransactionOutputTypeToWrappedOutput(
    transactionId: string,
    index: number,
    output: Output
): IWrappedOutput | undefined {
    if (output.type === OutputType.Treasury) {
        return undefined
    }
    const outputId = getOutputIdFromTransactionIdAndIndex(transactionId, index)
    return {
        outputId,
        output,
        remainder: false,
    }
}
