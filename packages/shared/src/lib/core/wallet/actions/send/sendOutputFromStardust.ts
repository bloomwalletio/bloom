import { IAccountState } from '@core/account/interfaces'
import { ledgerPreparedOutput } from '@core/ledger'
import { checkActiveProfileAuth } from '@core/profile/actions'
import { getIsActiveLedgerProfile } from '@core/profile/stores'
import { Output } from '@core/wallet/types'
import { validateSendConfirmation } from '@core/wallet/utils'
import { signAndSendStardustTransaction } from './signAndSendStardustTransaction'

export async function sendOutputFromStardust(preparedOutput: Output, account: IAccountState): Promise<void> {
    validateSendConfirmation(preparedOutput)

    if (getIsActiveLedgerProfile()) {
        ledgerPreparedOutput.set(preparedOutput)
    }

    return new Promise((resolve, reject) => {
        checkActiveProfileAuth(
            async () => {
                try {
                    await signAndSendStardustTransaction(preparedOutput, account)
                    resolve()
                } catch (err) {
                    reject(err)
                }
            },
            { stronghold: true, ledger: false, props: { preparedOutput } }
        )
    })
}
