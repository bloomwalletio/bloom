import { Platform } from '@core/app/classes'
import { addError } from '@core/error/stores'
import { setLedgerDeviceState } from '@core/ledger/stores'

export function registerLedgerDeviceEventHandlers(): void {
    Platform.onEvent('ledger-error', (error) => {
        if (error.message.includes('Locked device')) {
            setLedgerDeviceState({ locked: true, connected: true, blindSigningEnabled: false })
        } else if (error.message.includes('NoDevice')) {
            setLedgerDeviceState({ locked: false, connected: false, blindSigningEnabled: false })
        } else if (error.message.includes('0x6d02')) {
            setLedgerDeviceState({ locked: false, connected: true, blindSigningEnabled: false })
        } else {
            addError(error)
        }
    })
}
