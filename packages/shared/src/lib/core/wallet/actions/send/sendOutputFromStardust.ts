import { IAccountState } from '@core/account/interfaces'
import { ledgerPreparedOutput } from '@core/ledger'
import { checkActiveProfileAuth } from '@core/profile/actions'
import { getIsActiveLedgerProfile } from '@core/profile/stores'
import { resetSendFlowParameters } from '@core/wallet/stores'
import { Output } from '@core/wallet/types'
import { validateSendConfirmation } from '@core/wallet/utils'
import { signAndSendStardustTransaction } from './signAndSendStardustTransaction'

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
            resetSendFlowParameters()
        },
        { stronghold: true, ledger: false }
    )
    return
}
