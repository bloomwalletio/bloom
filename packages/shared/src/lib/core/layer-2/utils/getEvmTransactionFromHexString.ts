import { Converter } from '@core/utils'
import { LegacyTransaction, TransactionFactory } from '@ethereumjs/tx'
import { EvmTransactionData } from '../types'

export function getEvmTransactionFromHexString(transactionHex: string): EvmTransactionData & { from: string } {
    const transaction = TransactionFactory.fromSerializedData(Converter.hexToBytes(transactionHex)) as LegacyTransaction
    const sender = transaction.getSenderAddress().toString()

    const { nonce, gasPrice, gasLimit, to, value, data, v, r, s, type } = transaction

    return {
        nonce: Converter.bigIntToHex(nonce),
        gasPrice: Converter.bigIntToHex(gasPrice),
        gasLimit: Converter.bigIntToHex(gasLimit),
        to,
        value: Converter.bigIntToHex(value),
        data: Converter.bytesToHex(data),
        r: Converter.bigIntToHex(r),
        v: Converter.bigIntToHex(v),
        s: Converter.bigIntToHex(s),
        type,
        from: sender,
    }
}
