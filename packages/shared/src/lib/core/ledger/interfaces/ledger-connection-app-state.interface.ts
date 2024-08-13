import { LedgerAppName, LedgerConnectionState } from '../enums'

export interface ILedgerConnectionAppState {
    state: LedgerConnectionState
    app?: LedgerAppName
}
