import { LedgerApiMethod } from '@core/ledger/enums'

export interface ILedgerProcessMessage {
    method: LedgerApiMethod
    payload: (number | string | unknown)[] | unknown
    error?: string | Error | unknown
}
