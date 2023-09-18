import { get } from 'svelte/store'

import { showNotification } from '@auxiliary/notification'
import { handleError, handleGenericError } from '@core/error/handlers'
import { IError } from '@core/error/interfaces'
import { localize } from '@core/i18n/i18n'
import { checkOrConnectLedger, ledgerPreparedOutput, resetLedgerPreparedOutput } from '@core/ledger'
import { sendOutput } from '@core/wallet'
import { resetMintTokenDetails, resetMintNftDetails } from '@core/wallet/stores'
import { closePopup, openPopup, PopupId, popupState } from '../../../../../../desktop/lib/auxiliary/popup'

import { LEDGER_ERROR_LOCALES } from '../constants'
import { LedgerAppName, LedgerError } from '../enums'
import { deriveLedgerError } from '../helpers'

export function handleLedgerError(error: IError, resetConfirmationPropsOnDenial = true): void {
    const ledgerError = deriveLedgerError(error?.error)
    if (ledgerError in LEDGER_ERROR_LOCALES) {
        const popupType = get(popupState)?.id

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

        closePopup(true)

        /**
         * NOTE: Because the device has a warning prompt about blind signing when trying it
         * while it's disabled, the user has to manually reject it on the device. This results in
         * an error, however it is bad UX to display it to the user when they meant to do it.
         */
        const hadToEnableBlindSinging = popupType === PopupId.EnableLedgerBlindSigning && wasDeniedByUser
        if (hadToEnableBlindSinging) {
            openPopup({
                id: PopupId.EnableLedgerBlindSigning,
                props: {
                    appName: LedgerAppName.Shimmer,
                    onEnabled: () => {
                        checkOrConnectLedger(async () => {
                            try {
                                if (get(ledgerPreparedOutput)) {
                                    await sendOutput(get(ledgerPreparedOutput))
                                    resetLedgerPreparedOutput()
                                }
                            } catch (err) {
                                handleError(err)
                            }
                        })
                    },
                },
            })
        } else {
            showNotification({
                variant: wasDeniedByUser ? 'warning' : 'error',
                text: localize(LEDGER_ERROR_LOCALES[ledgerError]),
            })
        }
    } else {
        handleGenericError(error)
    }
}
