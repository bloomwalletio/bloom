import { checkOrConnectLedger } from '@core/ledger/actions'
import { LedgerAppName } from '@core/ledger/enums'
import { SupportedNetworkId } from '@core/network'
import { activeProfile, isActiveLedgerProfile, isSoftwareProfile } from '@core/profile/stores'
import { checkOrUnlockStronghold } from '@core/stronghold/actions'
import { get } from 'svelte/store'

export function checkActiveProfileAuth(
    callback: () => Promise<unknown> = async () => {},
    reopenPopup?: { stronghold?: boolean; ledger?: boolean; props?: Record<string, unknown> },
    ledgerAppName: LedgerAppName = get(activeProfile)?.network?.id === SupportedNetworkId.Iota
        ? LedgerAppName.IOTA
        : LedgerAppName.Shimmer,
    onCancel: () => void = (): void => {}
): Promise<unknown> {
    if (get(isSoftwareProfile)) {
        return checkOrUnlockStronghold(callback, reopenPopup?.stronghold, reopenPopup?.props, onCancel)
    } else if (get(isActiveLedgerProfile)) {
        return checkOrConnectLedger(callback, reopenPopup?.ledger, ledgerAppName, reopenPopup?.props, onCancel)
    }
    return Promise.resolve()
}
