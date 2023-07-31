import { callLedgerFunctionAsync } from '@core/ledger/actions'
import { Ledger } from '@core/ledger/classes'

import { IEvmTransactionSignature } from '../interfaces'
import { EvmTransactionData } from '../types'

import { prepareEvmTransaction } from './prepareEvmTransaction'

export async function signTransactionWithLedger(transaction: EvmTransactionData, bip32Path: string): Promise<string> {
    const unsignedTransactionMessageHex = prepareEvmTransaction(transaction)
    const transactionSignature = await callLedgerFunctionAsync<IEvmTransactionSignature>(
        () => Ledger.signEvmTransaction(unsignedTransactionMessageHex, bip32Path),
        'evm-signed-transaction'
    )
    const { r, v, s } = transactionSignature
    if (r && v && s) {
        return prepareEvmTransaction(transaction, { r, v, s })
    }
}
