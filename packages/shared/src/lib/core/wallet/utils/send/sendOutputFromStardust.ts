import { Output } from '@core/wallet/types'
import { validateSendConfirmation } from './validateSendConfirmation'
import { checkActiveProfileAuth, getIsActiveLedgerProfile } from '@core/profile'
import { ledgerPreparedOutput } from '@core/ledger'
import { signAndSendStardustTransaction } from './signAndSendStardustTransaction'
import { IAccountState } from '@core/account/interfaces'

export async function sendOutputFromStardust(
    output: Output,
    account: IAccountState,
    callback: () => void
): Promise<void> {
    validateSendConfirmation(output)

    if (getIsActiveLedgerProfile()) {
        ledgerPreparedOutput.set(output)
    }

    await checkActiveProfileAuth(
        async () => {
            await signAndSendStardustTransaction(output, account)
            callback()
        },
        { stronghold: true, ledger: false }
    )
    return
}
