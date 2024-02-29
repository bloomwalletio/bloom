import { HEX_PREFIX } from '@core/utils'
import { LegacyTransaction } from '@ethereumjs/tx'

export function getHexEncodedTransaction(transaction: LegacyTransaction): string {
    const serializedTransaction = transaction.serialize()
    const hexEncodedTransaction = HEX_PREFIX + Buffer.from(serializedTransaction).toString('hex')
    return hexEncodedTransaction
}
