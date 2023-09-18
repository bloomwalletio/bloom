import { get } from 'svelte/store'
import { checkOrConnectLedger } from '@core/ledger/actions'
import { LedgerAppName } from '@core/ledger/enums'
import { isActiveLedgerProfile, isSoftwareProfile } from '@core/profile/stores'
import { checkOrUnlockStronghold } from '@core/stronghold/actions'

export function checkActiveProfileAuth(
    callback: () => Promise<unknown> = async () => {},
    reopenPopup?: { stronghold?: boolean; ledger?: boolean; props?: Record<string, unknown> },
    ledgerAppName: LedgerAppName = LedgerAppName.Shimmer
): Promise<unknown> {
    if (get(isSoftwareProfile)) {
        return checkOrUnlockStronghold(callback, reopenPopup?.stronghold, reopenPopup?.props)
    } else if (get(isActiveLedgerProfile)) {
        return checkOrConnectLedger(callback, reopenPopup?.ledger, ledgerAppName, reopenPopup?.props)
    }
    return Promise.resolve()
}
