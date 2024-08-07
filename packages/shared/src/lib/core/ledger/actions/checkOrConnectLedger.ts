import { openProfileAuthPopup, ProfileAuthPopupId } from '../../../../../../desktop/lib/auxiliary/popup'
import { get } from 'svelte/store'
import { LedgerAppName, LedgerConnectionState, ledgerConnectionAppState } from '..'
import { activeProfile } from '@core/profile/stores'
import { SupportedNetworkId } from '@core/network/constants'

export function checkOrConnectLedger(
    ledgerAppName: LedgerAppName = get(activeProfile)?.network?.id === SupportedNetworkId.Iota
        ? LedgerAppName.Iota
        : LedgerAppName.Shimmer
): Promise<void> {
    const isCorrectApp = get(ledgerConnectionAppState)?.app === ledgerAppName
    const isOpen = get(ledgerConnectionAppState)?.state === LedgerConnectionState.AppOpen
    return new Promise((resolve, reject) => {
        if (isCorrectApp && isOpen) {
            resolve()
            return
        } else {
            openProfileAuthPopup({
                id: ProfileAuthPopupId.ConnectLedger,
                hideClose: true,
                props: {
                    ledgerAppName,
                    onSuccess: resolve,
                    onCancel: reject,
                },
            })
        }
    })
}
