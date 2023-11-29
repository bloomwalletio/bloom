import { Platform } from '@core/app/classes'
import { setLedgerDeviceState } from '@core/ledger/stores'

export function registerLedgerDeviceEventHandlers(): void {
    Platform.onEvent('ledger-error', (error) => {
        if (error.message.includes('Locked device')) {
            setLedgerDeviceState({ locked: true, connected: true, blindSigningEnabled: false })
        } else if (error.message.includes('NoDevice')) {
            setLedgerDeviceState({ connected: false, blindSigningEnabled: false })
        } else {
            // Unsupported application is open
            setLedgerDeviceState({ locked: false, connected: true, blindSigningEnabled: false })
        }
    })
}
