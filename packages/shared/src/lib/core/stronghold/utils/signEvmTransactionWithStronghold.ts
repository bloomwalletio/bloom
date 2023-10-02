import { TxData } from '@ethereumjs/tx'
import { prepareEvmTransaction } from '@core/layer-2/utils'
import { EvmChainId, getEvmTransactionOptions } from '@core/network'
import { removeLeadingZeros } from '@core/utils/buffer'
import { Transaction } from '@ethereumjs/tx'
import { ECDSASignature } from '@ethereumjs/util'
import type { Bip44 } from '@iota/sdk/out/types'
import { getSignatureForStringWithStronghold } from './getSignatureForStringWithStronghold'
import { HEX_PREFIX } from '@core/utils'

export async function signEvmTransactionWithStronghold(
    txData: TxData,
    bip44Path: Bip44,
    chainId: EvmChainId
): Promise<string> {
    const unsignedTransactionMessageHex = HEX_PREFIX + prepareEvmTransaction(txData, chainId)
    const transaction = Transaction.fromTxData(txData, getEvmTransactionOptions(chainId))

    const signature = await getSignatureForStringWithStronghold(unsignedTransactionMessageHex, bip44Path, chainId)
    const signedTransaction = createSignedTransaction(transaction, signature, chainId)
    return getHexEncodedTransaction(signedTransaction)
}

function createSignedTransaction(
    transaction: Transaction,
    signature: ECDSASignature,
    chainId: EvmChainId
): Transaction {
    const rawTx = transaction.raw()

    const vHex = padHexString(signature.v.toString(16))
    rawTx[6] = Buffer.from(vHex, 'hex')
    rawTx[7] = removeLeadingZeros(signature.r)
    rawTx[8] = removeLeadingZeros(signature.s)
    const signedTransaction = Transaction.fromValuesArray(rawTx, getEvmTransactionOptions(chainId))

    return signedTransaction
}

function getHexEncodedTransaction(transaction: Transaction): string {
    const serializedTransaction = transaction.serialize()
    const hexEncodedTransaction = '0x' + serializedTransaction.toString('hex')
    return hexEncodedTransaction
}

function padHexString(str: string): string {
    return str.length % 2 !== 0 ? '0' + str : str
}
