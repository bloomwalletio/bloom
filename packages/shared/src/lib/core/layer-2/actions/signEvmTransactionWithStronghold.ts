import { TxData } from '@ethereumjs/tx'
import { prepareEvmTransaction } from '@core/layer-2/utils'
import { EvmChainId, getEvmTransactionOptions } from '@core/network'
import { removeLeadingZeros } from '@core/utils/buffer'
import { Transaction } from '@ethereumjs/tx'
import { fromRpcSig, ECDSASignature } from '@ethereumjs/util'
import { api } from '@core/profile-manager'
import { getActiveProfile } from '@core/profile/stores'
import type { Bip44 } from '@iota/sdk/out/types'

export async function signEvmTransactionWithStronghold(
    txData: TxData,
    bip44Path: Bip44,
    chainId: EvmChainId
): Promise<string> {
    const unsignedTransactionMessageHex = '0x' + prepareEvmTransaction(txData, chainId)
    const transaction = Transaction.fromTxData(txData, getEvmTransactionOptions(chainId))

    const manager = await api.getSecretManager(getActiveProfile()?.id)
    const { signature } = await manager.signSecp256k1Ecdsa(unsignedTransactionMessageHex, bip44Path)

    // Make Secp256k1Ecdsa into an Eip155Compatible Signature
    const ecdsaSignature = fromRpcSig(signature)
    ecdsaSignature.v = convertsVToEip155Compatible(ecdsaSignature.v, Number(chainId))

    const signedTransaction = createSignedTransaction(transaction, ecdsaSignature, chainId)
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

function convertsVToEip155Compatible(v: bigint, chainId: number): bigint {
    const parity = Number(v) % 27
    const newV = chainId * 2 + (35 + parity)
    return BigInt(newV)
}

function padHexString(str: string): string {
    return str.length % 2 !== 0 ? '0' + str : str
}
