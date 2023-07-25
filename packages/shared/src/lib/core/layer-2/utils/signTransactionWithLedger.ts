import { RLP } from '@ethereumjs/rlp'
import { Transaction } from '@ethereumjs/tx'
import { bufArrToArr } from '@ethereumjs/util'

import { Platform } from '@core/app/classes'
import { localize } from '@core/i18n'
import { Ledger } from '@core/ledger/classes'
import { MILLISECONDS_PER_SECOND, sleep } from '@core/utils'

import { DEFAULT_EVM_TRANSACTION_OPTIONS } from '../constants'
import { IEvmTransactionSignature } from '../interfaces'
import { EvmTransactionData } from '../types'

export async function signTransactionWithLedger(transaction: EvmTransactionData, bip32Path: string): Promise<string> {
    const unsignedTransaction = Transaction.fromTxData(transaction, DEFAULT_EVM_TRANSACTION_OPTIONS)
    const unsignedTransactionMessage = unsignedTransaction.getMessageToSign(false)
    const unsignedTransactionMessageHex = Buffer.from(RLP.encode(bufArrToArr(unsignedTransactionMessage))).toString(
        'hex'
    )
    Ledger.signEvmTransaction(unsignedTransactionMessageHex, bip32Path)

    let isSigning = true
    let transactionSignature: IEvmTransactionSignature = {
        r: '',
        v: '',
        s: '',
    }

    function signingFinished(signature: IEvmTransactionSignature): void {
        isSigning = false
        transactionSignature = signature
    }

    Platform.onEvent('evm-signed-transaction', (signature) => {
        signingFinished(signature)
    })

    const POLLING_INTERVAL = 100
    const TIMEOUT_IN_SECONDS = 60
    const LOOP_ITERATIONS = (TIMEOUT_IN_SECONDS * MILLISECONDS_PER_SECOND) / POLLING_INTERVAL

    for (let count = 0; count < LOOP_ITERATIONS; count++) {
        if (!isSigning) {
            if (transactionSignature) {
                const { r, v, s } = transactionSignature
                if (!r || !v || !s) {
                    return Promise.reject('Ledger process returned invalid signature')
                }
                const signedTransactionData: EvmTransactionData = {
                    ...transaction,
                    r,
                    v,
                    s,
                }
                const signedTransaction = Transaction.fromTxData(signedTransactionData, DEFAULT_EVM_TRANSACTION_OPTIONS)
                const serializedSignedTransaction = Buffer.from(RLP.encode(bufArrToArr(signedTransaction.raw())))
                const serializedSignedTransactionHex = '0x' + serializedSignedTransaction.toString('hex')

                return Promise.resolve(serializedSignedTransactionHex)
            } else {
                return Promise.reject('Signing was rejected by the Ledger device')
            }
        }
        await sleep(POLLING_INTERVAL)
    }
    return Promise.reject(localize('error.ledger.timeout'))
}
