import { ILedgerDeviceState } from '../interfaces'
import { LedgerAppName, LedgerConnectionState } from '../enums'

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
