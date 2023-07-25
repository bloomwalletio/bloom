import { Platform } from '@core/app/classes'
import { localize } from '@core/i18n'
import { Ledger } from '@core/ledger/classes'
import { MILLISECONDS_PER_SECOND, sleep } from '@core/utils'

import { IEvmTransactionSignature } from '../interfaces'
import { EvmTransactionData } from '../types'

import { prepareEvmTransaction } from './prepareEvmTransaction'

export async function signTransactionWithLedger(transaction: EvmTransactionData, bip32Path: string): Promise<string> {
    const unsignedTransactionMessageHex = prepareEvmTransaction(transaction)
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
            const { r, v, s } = transactionSignature
            if (r && v && s) {
                const serializedSignedTransactionHex = prepareEvmTransaction(transaction, transactionSignature)
                return Promise.resolve(serializedSignedTransactionHex)
            } else {
                return Promise.reject('Signing was rejected by the Ledger device')
            }
        }
        await sleep(POLLING_INTERVAL)
    }
    return Promise.reject(localize('error.ledger.timeout'))
}
