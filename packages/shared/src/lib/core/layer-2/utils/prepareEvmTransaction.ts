import { Transaction } from '@ethereumjs/tx'
import { RLP } from '@ethereumjs/rlp'
import { bufArrToArr } from '@ethereumjs/util'

import { DEFAULT_EVM_TRANSACTION_OPTIONS } from '../constants'
import { IEvmTransactionSignature } from '../interfaces'
import { EvmTransactionData } from '../types'

export function prepareEvmTransaction(
    transactionData: EvmTransactionData,
    transactionSignature?: IEvmTransactionSignature
): string {
    const { r, v, s } = transactionSignature ?? {}
    const isSigned = r && v && s
    const preparedTransactionData = isSigned ? { ...transactionData, r, v, s } : transactionData
    const transaction = Transaction.fromTxData(preparedTransactionData, DEFAULT_EVM_TRANSACTION_OPTIONS)
    const transactionBuffer = isSigned ? transaction.raw() : transaction.getMessageToSign(false)
    const transactionHex = Buffer.from(RLP.encode(bufArrToArr(transactionBuffer))).toString('hex')
    return isSigned ? '0x' + transactionHex : transactionHex
}
