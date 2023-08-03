import { IAccountState } from '@core/account'
import { EvmTransactionData } from '@core/layer-2/types'
import { prepareEvmTransaction } from '@core/layer-2/utils'
import { Transaction } from '@ethereumjs/tx'
import { fromRpcSig, ECDSASignature } from '@ethereumjs/util'
import { DEFAULT_EVM_TRANSACTION_OPTIONS } from '@core/layer-2'
import type { Bip44 } from '@iota/wallet/types'

export async function signEvmTransactionWithStronghold(
    txData: EvmTransactionData,
    bip44Path: Bip44,
    chainId: number,
    account: IAccountState
): Promise<string> {
    const unsignedTransactionMessageHex = '0x' + prepareEvmTransaction(txData)
    const transaction = Transaction.fromTxData(txData, DEFAULT_EVM_TRANSACTION_OPTIONS)

    const { signature } = await account.signSecp256k1Ecdsa(unsignedTransactionMessageHex, bip44Path)

    // Make Secp256k1Ecdsa into an Eip155Compatible Signature
    const ecdsaSignature = fromRpcSig(signature)
    ecdsaSignature.v = convertsVToEip155Compatible(ecdsaSignature.v, chainId)

    const signedTransaction = createSignedTransaction(transaction, ecdsaSignature)
    return getHexEncodedTransaction(signedTransaction)
}

function createSignedTransaction(transaction: Transaction, signature: ECDSASignature): Transaction {
    const rawTx = transaction.raw()

    const vHex = padHexString(signature.v.toString(16))
    rawTx[6] = Buffer.from(vHex, 'hex')
    rawTx[7] = signature.r
    rawTx[8] = signature.s
    const signedTransaction = Transaction.fromValuesArray(rawTx, DEFAULT_EVM_TRANSACTION_OPTIONS)

    return signedTransaction
}

function getHexEncodedTransaction(transaction: Transaction): string {
    const serializedTransaction = transaction.serialize()
    const hexEncodedTransaction = '0x' + serializedTransaction.toString('hex')
    return hexEncodedTransaction
}

function convertsVToEip155Compatible(v: bigint, chainId: number): bigint {
    const parity = Number(v) % 27
    const newV = chainId * 2 + (35 + parity)
    return BigInt(newV)
}

function padHexString(str: string): string {
    return str.length % 2 !== 0 ? '0' + str : str
}
