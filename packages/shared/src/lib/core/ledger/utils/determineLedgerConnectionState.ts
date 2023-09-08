import { LedgerNanoStatus } from '@iota/sdk/out/types'
import { LedgerConnectionState } from '../interfaces'
import { LedgerAppName } from '../enums'

export function determineLedgerConnectionState(
    status: LedgerNanoStatus,
    appName = LedgerAppName.Shimmer
): LedgerConnectionState {
    const { connected, app } = status
    if (connected) {
        if (app) {
            if (app.name === (appName as string)) {
                return LedgerConnectionState.CorrectAppOpen
            } else {
                return LedgerConnectionState.AppNotOpen
            }
        } else {
            return LedgerConnectionState.Locked
        }
    } else {
        return LedgerConnectionState.NotConnected
    }
}
