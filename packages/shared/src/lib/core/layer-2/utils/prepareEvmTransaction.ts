import { EvmChainId, getEvmTransactionOptions } from '@core/network'
import { HEX_PREFIX } from '@core/utils'
import { RLP } from '@ethereumjs/rlp'
import { Transaction } from '@ethereumjs/tx'
import { bufArrToArr } from '@ethereumjs/util'
import { IEvmTransactionSignature } from '../interfaces'
import { EvmTransactionData } from '../types'

export function prepareEvmTransaction(
    transactionData: EvmTransactionData,
    chainId: EvmChainId,
    transactionSignature?: IEvmTransactionSignature
): string {
    const { r, v, s } = transactionSignature ?? {}
    const isSigned = r && v && s
    const preparedTransactionData = isSigned ? { ...transactionData, r, v, s } : transactionData
    const transaction = Transaction.fromTxData(preparedTransactionData, getEvmTransactionOptions(chainId))
    const transactionBuffer = isSigned ? transaction.raw() : transaction.getMessageToSign(false)
    const transactionHex = Buffer.from(RLP.encode(bufArrToArr(transactionBuffer))).toString('hex')
    return isSigned ? HEX_PREFIX + transactionHex : transactionHex
}
