import { LedgerMethod } from '../enums/ledger-method.enum'

export interface ILedgerProcessMessage {
    method: LedgerMethod
    payload: (number | string | unknown)[] | unknown
    error?: string | Error | unknown
}
