import { TransactionData } from '../../types'
import { getOutputParameters } from '../getOutputParameters'
import { prepareOutput } from '@core/account'
import { DEFAULT_TRANSACTION_OPTIONS } from '../../constants'
import { validateSendConfirmation } from '.'
import { checkActiveProfileAuth, getIsActiveLedgerProfile } from '@core/profile'
import { ledgerPreparedOutput } from '@core/ledger'
import { sendOutput } from '../../actions'

export async function createStardustTransaction(
    transactionData: TransactionData,
    accountIndex: number,
    callback: () => void
): Promise<void> {
    const outputParams = await getOutputParameters(transactionData)
    const preparedOutput = await prepareOutput(accountIndex, outputParams, DEFAULT_TRANSACTION_OPTIONS)

    validateSendConfirmation(preparedOutput)

    if (getIsActiveLedgerProfile()) {
        ledgerPreparedOutput.set(preparedOutput)
    }

    await checkActiveProfileAuth(
        async () => {
            await sendOutput(preparedOutput)
            callback()
        },
        { stronghold: true, ledger: false }
    )
}
