import { Converter } from '@core/utils'
import { LegacyTransaction, TransactionFactory } from '@ethereumjs/tx'
import { EvmTransactionData } from '../types'

export function getEvmTransactionFromHexString(transactionHex: string): EvmTransactionData & { from: string } {
    const transactionData = TransactionFactory.fromSerializedData(Converter.hexToBytes(transactionHex)).toJSON()
    const transaction = TransactionFactory.fromTxData(transactionData) as LegacyTransaction
    const sender = transaction.getSenderAddress().toString()

    const { nonce, gasPrice, gasLimit, to, value, data, v, r, s, type } = transaction

    return {
        nonce,
        gasPrice: gasPrice.toString(16),
        gasLimit: gasLimit.toString(16),
        to,
        value: value.toString(16),
        data: Converter.bytesToHex(data),
        r: r?.toString(16),
        v: v?.toString(16),
        s: s?.toString(16),
        type,
        from: sender,
    }
}
