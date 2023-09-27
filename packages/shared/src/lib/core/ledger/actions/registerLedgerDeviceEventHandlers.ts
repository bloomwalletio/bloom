import { Platform } from '@core/app/classes'
import { logAndNotifyError } from '@core/error/actions'
import { setLedgerDeviceState } from '@core/ledger/stores'

export function registerLedgerDeviceEventHandlers(): void {
    Platform.onEvent('ledger-error', (error) => {
        if (error.message.includes('Locked device')) {
            setLedgerDeviceState({ locked: true, connected: true, blindSigningEnabled: false })
        } else if (error.message.includes('NoDevice')) {
            setLedgerDeviceState({ locked: false, connected: false, blindSigningEnabled: false })
        } else {
            // Another application is open with a CLA_NOT_SUPPORTED_ERROR
            setLedgerDeviceState({ locked: false, connected: true, blindSigningEnabled: false })
            logAndNotifyError({
                type: 'Ledger',
                message: error.message,
                logToConsole: true,
                saveToErrorLog: true,
                showNotification: true,
            })
        }
    })
}
