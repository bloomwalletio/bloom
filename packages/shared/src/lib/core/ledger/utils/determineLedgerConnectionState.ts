import { LedgerAppName, LedgerConnectionState } from '../enums'
import { ILedgerDeviceState } from '../interfaces'

export function determineLedgerConnectionState(status: ILedgerDeviceState): LedgerConnectionState {
    const { connected, locked, app } = status
    if (connected) {
        if (locked) {
            return LedgerConnectionState.Locked
        } else {
            switch (app) {
                case LedgerAppName.Shimmer:
                    return LedgerConnectionState.ShimmerAppOpen
                case LedgerAppName.Ethereum:
                    return LedgerConnectionState.EthereumAppOpen
                default:
                    return LedgerConnectionState.AppNotOpen
            }
        }
    } else {
        return LedgerConnectionState.NotConnected
    }
}
