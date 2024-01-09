import { openPopup, PopupId } from '../../../../../../desktop/lib/auxiliary/popup'
import { get } from 'svelte/store'
import { LedgerAppName, LedgerConnectionState, ledgerConnectionState } from '..'
import { activeProfile } from '@core/profile/stores'
import { SupportedNetworkId } from '@core/network/enums'

export function checkOrConnectLedgerAsync(
    ledgerAppName: LedgerAppName = get(activeProfile)?.network?.id === SupportedNetworkId.Iota
        ? LedgerAppName.Iota
        : LedgerAppName.Shimmer
): Promise<void> {
    const ledgerConnected = get(ledgerConnectionState) === (ledgerAppName as unknown as LedgerConnectionState)
    return new Promise((resolve, reject) => {
        if (ledgerConnected) {
            resolve()
            return
        } else {
            openPopup({
                id: PopupId.ConnectLedger,
                hideClose: true,
                props: {
                    ledgerAppName,
                    onContinue: resolve,
                    onCancel: reject,
                },
            })
        }
    })
}
