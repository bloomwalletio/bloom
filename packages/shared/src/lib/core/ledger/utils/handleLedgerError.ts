import { get } from 'svelte/store'

import { localize } from '@core/i18n/i18n'
import { resetMintTokenDetails, resetMintNftDetails } from '@core/wallet/stores'
import { IError } from '@core/error/interfaces'
import { handleError, handleGenericError } from '@core/error/handlers'
import { showNotification } from '@auxiliary/notification'
import {
    closeProfileAuthPopup,
    openProfileAuthPopup,
    profileAuthPopup,
    ProfileAuthPopupId,
} from '../../../../../../desktop/lib/auxiliary/popup'

import { LEDGER_ERROR_LOCALES } from '../constants'
import { LedgerError } from '../enums'
import { deriveLedgerError } from '../helpers'
import { checkOrConnectLedger, ledgerPreparedOutput, resetLedgerPreparedOutput } from '@core/ledger'
import { sendOutput } from '@core/wallet'
import { getProfileLedgerAppName } from '@core/profile/actions/active-profile'

export function handleLedgerError(err: unknown, resetConfirmationPropsOnDenial = true): void {
    const error = (err as IError)?.error ?? (err as string)
    const ledgerError = deriveLedgerError(error)
    if (!ledgerError || !(ledgerError in LEDGER_ERROR_LOCALES)) {
        handleGenericError(error)
        return
    }

    const popupType = get(profileAuthPopup)?.id

    const wasDeniedByUser = ledgerError === LedgerError.DeniedByUser

    /**
     * NOTE: We may wish to reset the confirmation props to avoid
     * re-opening the popup if the user manually rejected the prompt
     * on the device.
     */
    if (wasDeniedByUser && resetConfirmationPropsOnDenial) {
        resetMintTokenDetails()
        resetMintNftDetails()
    }

    closeProfileAuthPopup({ forceClose: true })

    /**
     * NOTE: Because the device has a warning prompt about blind signing when trying it
     * while it's disabled, the user has to manually reject it on the device. This results in
     * an error, however it is bad UX to display it to the user when they meant to do it.
     */
    const hadToEnableBlindSinging = popupType === ProfileAuthPopupId.EnableLedgerBlindSigning && wasDeniedByUser
    if (hadToEnableBlindSinging) {
        const appName = getProfileLedgerAppName()
        openProfileAuthPopup({
            id: ProfileAuthPopupId.EnableLedgerBlindSigning,
            props: {
                appName,
                onEnabled: async () => {
                    try {
                        await checkOrConnectLedger()
                        const preparedOutput = get(ledgerPreparedOutput)
                        if (preparedOutput) {
                            await sendOutput(preparedOutput)
                            resetLedgerPreparedOutput()
                        }
                    } catch (err) {
                        handleError(err)
                    }
                },
            },
        })
    } else {
        showNotification({
            variant: wasDeniedByUser ? 'warning' : 'error',
            text: localize(LEDGER_ERROR_LOCALES[ledgerError]),
        })
    }
}
