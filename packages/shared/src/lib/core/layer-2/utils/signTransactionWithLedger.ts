import { Ledger, callLedgerFunctionAsync } from '@core/ledger'
import { EvmTransactionData } from '../types'

export async function signTransactionWithLedger(transaction: EvmTransactionData, bip32Path: string): Promise<string> {
    const response = await callLedgerFunctionAsync<{ signedTransaction: string }>(
        () => Ledger.signEvmTransaction(transaction, bip32Path),
        'evm-signed-transaction'
    )
    return response.signedTransaction
}
