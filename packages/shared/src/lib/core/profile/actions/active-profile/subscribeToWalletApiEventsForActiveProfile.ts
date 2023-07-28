import { WalletEventType } from '@iota/sdk/out/types/wallet'

import {
    getProfileManager,
    handleNewOutputEvent,
    handleSpentOutputEvent,
    handleTransactionInclusionEvent,
    handleTransactionProgressEvent,
    subscribeToWalletApiEvents,
    WalletApiEventMap,
} from '@core/profile-manager'

export function subscribeToWalletApiEventsForActiveProfile(): void {
    const profileManager = getProfileManager()
    const eventMap: WalletApiEventMap = {
        [WalletEventType.NewOutput]: handleNewOutputEvent,
        [WalletEventType.SpentOutput]: handleSpentOutputEvent,
        [WalletEventType.TransactionInclusion]: handleTransactionInclusionEvent,
        [WalletEventType.TransactionProgress]: handleTransactionProgressEvent,
    }
    subscribeToWalletApiEvents({
        eventMap,
        profileManager,
    })
}
