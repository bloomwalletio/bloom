import { Output } from '@core/wallet/types'
import { validateSendConfirmation } from './validateSendConfirmation'
import { checkActiveProfileAuth, getIsActiveLedgerProfile } from '@core/profile'
import { ledgerPreparedOutput } from '@core/ledger'
import { sendOutput } from '@core/wallet/actions'

export async function sendOutputFromStardust(output: Output, callback: () => void): Promise<void> {
    validateSendConfirmation(output)

    if (getIsActiveLedgerProfile()) {
        ledgerPreparedOutput.set(output)
    }

    await checkActiveProfileAuth(
        async () => {
            await sendOutput(output)
            callback()
        },
        { stronghold: true, ledger: false }
    )
    return
}
