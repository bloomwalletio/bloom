import { LedgerApiMethod } from '@core/ledger/enums'

export interface ILedgerProcessMessage {
    method: LedgerApiMethod
    payload: string[]
    error?: string | Error | unknown
}
