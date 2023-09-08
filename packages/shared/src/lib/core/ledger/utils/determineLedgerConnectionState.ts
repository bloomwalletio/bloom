import { LedgerAppName, LedgerConnectionState } from '../enums'
import { ILedgerDeviceState } from '../interfaces'

export function determineLedgerConnectionState(
    status: ILedgerDeviceState,
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
