import { openProfileAuthPopup, ProfileAuthPopupId } from '../../../../../../desktop/lib/auxiliary/popup'
import { get } from 'svelte/store'
import { LedgerAppName, LedgerConnectionState, ledgerConnectionAppState } from '..'
import { getProfileLedgerAppName } from '@core/profile/actions/active-profile'

export function checkOrConnectLedger(ledgerAppName: LedgerAppName = getProfileLedgerAppName()): Promise<void> {
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
