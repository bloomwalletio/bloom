import { Platform } from '@core/app/classes'
import { addError } from '@core/error/stores'

export function registerLedgerDeviceEventHandlers(): void {
    Platform.onEvent('ledger-error', (error) => {
        addError(error)
    })
}
