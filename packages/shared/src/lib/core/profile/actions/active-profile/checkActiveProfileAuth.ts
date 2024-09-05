import { checkOrConnectLedger } from '@core/ledger/actions'
import { LedgerAppName } from '@core/ledger/enums'
import { isActiveLedgerProfile, isSoftwareProfile } from '@core/profile/stores'
import { getProfileLedgerAppName } from '@core/profile/utils'
import { checkOrUnlockStronghold } from '@core/stronghold/actions'
import { get } from 'svelte/store'

export async function checkActiveProfileAuth(ledgerAppName: LedgerAppName = getProfileLedgerAppName()): Promise<void> {
    if (get(isSoftwareProfile)) {
        await checkOrUnlockStronghold()
    } else if (get(isActiveLedgerProfile)) {
        await checkOrConnectLedger(ledgerAppName)
    }
    return Promise.resolve()
}
