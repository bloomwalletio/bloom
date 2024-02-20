import { isVersionLessThan } from '@core/utils'
import { MINIMUM_SUPPORTED_IOTA_LEDGER_APP } from '../constants'
import { LedgerAppName, LedgerConnectionState } from '../enums'
import { ILedgerDeviceState } from '../interfaces'

export function determineLedgerConnectionState(status: ILedgerDeviceState): LedgerConnectionState {
    const { connected, locked, app } = status
    if (connected) {
        if (locked) {
            return LedgerConnectionState.Locked
        } else {
            switch (app) {
                case LedgerAppName.Iota: {
                    const version = status.settings?.[LedgerAppName.Iota]?.version
                    if (version && isVersionLessThan(version, MINIMUM_SUPPORTED_IOTA_LEDGER_APP)) {
                        return LedgerConnectionState.AppNotOpen
                    } else {
                        return LedgerConnectionState.IotaAppOpen
                    }
                }
                case LedgerAppName.Shimmer:
                    return LedgerConnectionState.ShimmerAppOpen
                case LedgerAppName.Ethereum:
                    return LedgerConnectionState.EthereumAppOpen
                default:
                    return LedgerConnectionState.AppNotOpen
            }
        }
    } else {
        return LedgerConnectionState.Disconnected
    }
}
