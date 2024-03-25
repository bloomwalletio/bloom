import { LedgerError } from '../enums'

export function deriveLedgerError(error: string | undefined): LedgerError | undefined {
    if (typeof error === 'string') {
        return Object.values(LedgerError).find((ledgerError) => error?.includes(ledgerError))
    } else {
        return undefined
    }
}
