import { checkOrConnectLedger } from '@core/ledger/actions'
import { LedgerAppName } from '@core/ledger/enums'
import { getStardustNetwork, SupportedNetworkId } from '@core/network'
import { isActiveLedgerProfile, isSoftwareProfile } from '@core/profile/stores'
import { checkOrUnlockStronghold } from '@core/stronghold/actions'
import { get } from 'svelte/store'

export async function checkActiveProfileAuth(
    ledgerAppName: LedgerAppName = getStardustNetwork()?.id === SupportedNetworkId.Iota
        ? LedgerAppName.Iota
        : LedgerAppName.Shimmer
): Promise<void> {
    if (get(isSoftwareProfile)) {
        await checkOrUnlockStronghold()
    } else if (get(isActiveLedgerProfile)) {
        await checkOrConnectLedger(ledgerAppName)
    }
    return Promise.resolve()
}
