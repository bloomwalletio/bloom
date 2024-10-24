import { LegacyTransaction, TransactionFactory, TypedTxData } from '@ethereumjs/tx'
import { getHexEncodedTransaction, prepareEvmTransaction } from '@core/layer-2/utils'
import { ChainId, getEvmTransactionOptions } from '@core/network'
import { removeLeadingZeros } from '@core/utils/array'
import { ECDSASignature } from '@ethereumjs/util'
import type { Bip44 } from '@iota/sdk/out/types'
import { getSignatureForStringWithStronghold } from './getSignatureForStringWithStronghold'
import { HEX_PREFIX } from '@core/utils'

export async function signEvmTransactionWithStronghold(
    txData: TypedTxData,
    chainId: ChainId,
    bip44Path: Bip44
): Promise<string> {
    const unsignedTransactionMessageHex = HEX_PREFIX + prepareEvmTransaction(txData, chainId)
    const transaction = TransactionFactory.fromTxData(txData, getEvmTransactionOptions(chainId)) as LegacyTransaction

    const signature = await getSignatureForStringWithStronghold(unsignedTransactionMessageHex, bip44Path, chainId)
    const signedTransaction = createSignedTransaction(transaction, signature, chainId)
    return getHexEncodedTransaction(signedTransaction)
}

function createSignedTransaction(
    transaction: LegacyTransaction,
    signature: ECDSASignature,
    chainId: ChainId
): LegacyTransaction {
    const rawTx = transaction.raw()

    const vHex = padHexString(signature.v.toString(16))
    rawTx[6] = Buffer.from(vHex, 'hex')
    rawTx[7] = removeLeadingZeros(signature.r)
    rawTx[8] = removeLeadingZeros(signature.s)
    const signedTransaction = LegacyTransaction.fromValuesArray(rawTx, getEvmTransactionOptions(chainId))

    return signedTransaction
}

function padHexString(str: string): string {
    return str.length % 2 !== 0 ? '0' + str : str
}
