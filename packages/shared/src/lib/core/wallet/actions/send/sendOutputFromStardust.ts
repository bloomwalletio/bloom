import { IAccountState } from '@core/account/interfaces'
import { ledgerPreparedOutput } from '@core/ledger'
import { checkActiveProfileAuth, getIsActiveLedgerProfile } from '@core/profile'
import { Output } from '@core/wallet/types'
import { validateSendConfirmation } from '@core/wallet/utils'
import { signAndSendStardustTransaction } from './signAndSendStardustTransaction'
import { resetNewTokenTransactionData } from '@core/wallet/stores'

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
            resetNewTokenTransactionData()
        },
        { stronghold: true, ledger: false }
    )
    return
}
