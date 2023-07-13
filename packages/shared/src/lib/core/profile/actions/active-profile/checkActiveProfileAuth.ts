import { LedgerAppName, checkOrConnectLedger } from '@core/ledger'
import { isActiveLedgerProfile, isSoftwareProfile } from '@core/profile'
import { checkOrUnlockStronghold } from '@core/stronghold'
import { get } from 'svelte/store'

export function checkActiveProfileAuth(
    callback: () => Promise<unknown> = async () => {},
    reopenPopup?: { stronghold?: boolean; ledger?: boolean },
    ledgerAppName: LedgerAppName = LedgerAppName.Shimmer
): Promise<unknown> {
    if (get(isSoftwareProfile)) {
        return checkOrUnlockStronghold(callback, reopenPopup?.stronghold)
    } else if (get(isActiveLedgerProfile)) {
        return checkOrConnectLedger(callback, reopenPopup?.ledger, ledgerAppName)
    }
    return Promise.resolve()
}
