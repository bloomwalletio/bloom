import { EvmChainId, getEvmTransactionOptions } from '@core/network'
import { HEX_PREFIX } from '@core/utils'
import { RLP } from '@ethereumjs/rlp'
import { TransactionFactory } from '@ethereumjs/tx'
import { IEvmSignature } from '../interfaces'
import { EvmTransactionData } from '../types'

export function prepareEvmTransaction(
    transactionData: EvmTransactionData,
    chainId: EvmChainId,
    transactionSignature?: IEvmSignature
): string {
    const { r, v, s } = transactionSignature ?? {}
    const isSigned = r && v && s
    const preparedTransactionData = isSigned ? { ...transactionData, r, v, s } : transactionData
    const transaction = TransactionFactory.fromTxData(preparedTransactionData, getEvmTransactionOptions(chainId))

    const transactionBuffer = isSigned ? transaction.raw() : transaction.getMessageToSign()
    const transactionHex = Buffer.from(RLP.encode(transactionBuffer)).toString('hex')
    return isSigned ? HEX_PREFIX + transactionHex : transactionHex
}
