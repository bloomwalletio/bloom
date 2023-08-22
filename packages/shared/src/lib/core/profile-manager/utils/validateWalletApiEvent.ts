import { localize } from '@core/i18n'
import type { Event, WalletEventType } from '@iota/sdk/out/types'
import { WalletApiEventError } from '../errors/wallet-api-event.error'
import { WalletApiEventValidationError } from '../errors/wallet-api-event-validation.error'

export function validateWalletApiEvent<T>(error: Error, event: Event, walletEventType: WalletEventType): T {
    if (error) {
        throw new WalletApiEventError(error)
    } else {
        const { accountIndex, event: walletEvent } = event
        if (Number.isNaN(accountIndex)) {
            throw new WalletApiEventValidationError(
                localize('error.walletApiEvent.invalidAccountIndex', { values: { eventName: walletEventType } })
            )
        }

        if (walletEvent.type !== walletEventType) {
            throw new WalletApiEventValidationError(
                localize('error.walletApiEvent.invalidPayload', { values: { eventName: walletEventType } })
            )
        }

        return walletEvent as T
    }
}
