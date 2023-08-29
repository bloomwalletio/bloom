import { ILedgerNanoState, LedgerConnectionState } from '../interfaces'
import { LedgerAppName } from '../enums'

export function determineLedgerConnectionState(
    status: ILedgerNanoState,
    appName = LedgerAppName.Shimmer
): LedgerConnectionState {
    const { connected, locked, app } = status
    if (connected) {
        if (locked) {
            return LedgerConnectionState.Locked
        } else {
            if (app === appName) {
                return LedgerConnectionState.CorrectAppOpen
            } else {
                return LedgerConnectionState.AppNotOpen
            }
        }
    } else {
        return LedgerConnectionState.NotConnected
    }
}
