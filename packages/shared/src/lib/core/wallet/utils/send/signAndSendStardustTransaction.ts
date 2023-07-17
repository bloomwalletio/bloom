import { Output } from '../../types'
import { checkActiveProfileAuth, getIsActiveLedgerProfile } from '@core/profile'
import { ledgerPreparedOutput } from '@core/ledger'
import { sendOutput } from '../../actions'

export async function signAndSendStardustTransaction(output: Output, callback: () => void): Promise<void> {
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
}
