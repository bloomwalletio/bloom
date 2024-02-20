import { checkOrConnectLedgerAsync } from '@core/ledger/actions'
import { LedgerAppName } from '@core/ledger/enums'
import { SupportedNetworkId } from '@core/network'
import { activeProfile, isActiveLedgerProfile, isSoftwareProfile } from '@core/profile/stores'
import { checkOrUnlockStrongholdAsync } from '@core/stronghold/actions'
import { get } from 'svelte/store'

export async function checkActiveProfileAuthAsync(
    ledgerAppName: LedgerAppName = get(activeProfile)?.network?.id === SupportedNetworkId.Iota
        ? LedgerAppName.Iota
        : LedgerAppName.Shimmer
): Promise<void> {
    if (get(isSoftwareProfile)) {
        await checkOrUnlockStrongholdAsync()
    } else if (get(isActiveLedgerProfile)) {
        await checkOrConnectLedgerAsync(ledgerAppName)
    }
    return Promise.resolve()
}
