import { RLP } from '@ethereumjs/rlp'
import { Transaction } from '@ethereumjs/tx'
import { bufArrToArr } from '@ethereumjs/util'

import { Platform } from '@core/app/classes'
import { localize } from '@core/i18n'
import { Ledger } from '@core/ledger/classes'
import { MILLISECONDS_PER_SECOND, sleep } from '@core/utils'

import { DEFAULT_EVM_TRANSACTION_OPTIONS } from '../constants'
import { EvmTransactionData } from '../types'

export async function signTransactionWithLedger(transaction: EvmTransactionData, bip32Path: string): Promise<string> {
    const unsignedTransaction = Transaction.fromTxData(transaction, DEFAULT_EVM_TRANSACTION_OPTIONS)

    const unsignedTransactionMessage = unsignedTransaction.getMessageToSign(false)
    const unsignedTransactionMessageHex = Buffer.from(RLP.encode(bufArrToArr(unsignedTransactionMessage))).toString(
        'hex'
    )
    Ledger.signEvmTransaction(unsignedTransactionMessageHex, bip32Path)

    let isSigning = true
    let signedTransaction = ''

    function signingFinished(_signedTransaction: string): void {
        isSigning = false
        signedTransaction = _signedTransaction
    }

    Platform.onEvent('evm-signed-transaction', ({ signedTransaction }) => {
        signingFinished(signedTransaction)
    })

    const POLLING_INTERVAL = 100
    const TIMEOUT_IN_SECONDS = 60
    const LOOP_ITERATIONS = (TIMEOUT_IN_SECONDS * MILLISECONDS_PER_SECOND) / POLLING_INTERVAL

    for (let count = 0; count < LOOP_ITERATIONS; count++) {
        if (!isSigning) {
            if (signedTransaction) {
                return Promise.resolve(signedTransaction)
            } else {
                return Promise.reject('Signing was rejected by the Ledger device')
            }
        }
        await sleep(POLLING_INTERVAL)
    }
    return Promise.reject(localize('error.ledger.timeout'))
}
