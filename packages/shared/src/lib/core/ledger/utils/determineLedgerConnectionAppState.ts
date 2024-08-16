import { LedgerConnectionState, LedgerAppName } from '../enums'
import { ILedgerDeviceState } from '../interfaces'
import { ILedgerConnectionAppState } from '../interfaces/ledger-connection-app-state.interface'
import { isLedgerAppVersionSupported } from './isLedgerAppVersionSupported'

export function determineLedgerConnectionAppState(status: ILedgerDeviceState): ILedgerConnectionAppState {
    const { connected, locked, app } = status

    if (!connected) {
        return {
            state: LedgerConnectionState.Disconnected,
        }
    }

    if (locked) {
        return {
            state: LedgerConnectionState.Locked,
        }
    }

    if (!app || app === LedgerAppName.Bolos) {
        return {
            state: LedgerConnectionState.AppNotOpen,
        }
    }

    if (!isLedgerAppVersionSupported(app)) {
        return {
            state: LedgerConnectionState.UnsupportedVersion,
            app,
        }
    }

    return {
        state: LedgerConnectionState.AppOpen,
        app,
    }
}
