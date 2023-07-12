import { Ledger } from '@core/ledger'
import { EvmTransactionData } from '../types'
import { Platform } from '@core/app'
import { MILLISECONDS_PER_SECOND, sleep } from '@core/utils'
import { localize } from '@core/i18n'

export async function signTransactionWithLedger(transaction: EvmTransactionData, bip32Path: string): Promise<string> {
    Ledger.signEvmTransaction(transaction, bip32Path)

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
