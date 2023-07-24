import { localize } from '@core/i18n'

import { WalletApiEventError, WalletApiEventValidationError } from '../errors'
import type { Event, WalletEventType } from '@iota/wallet'

export function validateWalletApiEvent(error: Error, walletEvent: Event, eventType: WalletEventType): Event {
    if (error) {
        throw new WalletApiEventError(error)
    } else {
        const { accountIndex, event } = walletEvent
        if (Number.isNaN(accountIndex)) {
            throw new WalletApiEventValidationError(
                localize('error.walletApiEvent.invalidAccountIndex', { values: { eventName: eventType } })
            )
        }

        if (event.type !== eventType) {
            throw new WalletApiEventValidationError(
                localize('error.walletApiEvent.invalidPayload', { values: { eventName: eventType } })
            )
        }

        return walletEvent
    }
}
