import { openPopup, PopupId, popupState } from '../../../../../../desktop/lib/auxiliary/popup'
import { get } from 'svelte/store'
import { handleError } from '@core/error/handlers/handleError'
import { determineLedgerConnectionState, LedgerAppName, LedgerConnectionState, ledgerDeviceState } from '..'

export function checkOrConnectLedger(
    callback: () => Promise<unknown> = async (): Promise<void> => {},
    reopenPopup?: boolean,
    ledgerAppName: LedgerAppName = LedgerAppName.Shimmer,
    reopenProps: Record<string, unknown> = {}
): Promise<unknown> {
    const previousPopup = get(popupState)
    function _callback(): Promise<unknown> {
        if (reopenPopup) {
            openPopup({ ...previousPopup, props: { ...previousPopup.props, ...reopenProps, _onMount: callback } })
            return Promise.resolve()
        } else {
            return callback()
        }
    }
    try {
        const ledgerConnectionState = determineLedgerConnectionState(get(ledgerDeviceState), ledgerAppName)
        const ledgerConnected = ledgerConnectionState === LedgerConnectionState.CorrectAppOpen
        if (ledgerConnected) {
            return callback()
        } else {
            openPopup({
                id: PopupId.ConnectLedger,
                hideClose: true,
                props: {
                    ledgerAppName,
                    onContinue: _callback,
                },
            })
        }
    } catch (err) {
        handleError(err)
    }
    return Promise.resolve()
}
