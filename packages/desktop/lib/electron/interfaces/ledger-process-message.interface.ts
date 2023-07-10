import { LedgerMethod } from '../enums/ledger-method.enum'

export interface ILedgerProcessMessage {
    error?: string | Error | unknown
    data: ILedgerProcessMessageData
}

export interface ILedgerProcessMessageData {
    method: LedgerMethod
    parameters: (string | unknown)[]
}
