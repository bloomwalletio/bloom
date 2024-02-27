import { Converter } from '@core/utils'
import { TransactionFactory } from '@ethereumjs/tx'
import { EvmTransactionData } from '../types'

export function getEvmTransactionFromHexString(transactionHex: string): EvmTransactionData & { from: string } {
    const transactionData = TransactionFactory.fromSerializedData(Converter.hexToBytes(transactionHex)).toJSON()
    const transaction = TransactionFactory.fromTxData(transactionData)
    const sender = transaction.getSenderAddress().toString()

    return { ...transaction, from: sender }
}
