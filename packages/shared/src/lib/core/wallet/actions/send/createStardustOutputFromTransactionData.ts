import { prepareOutput } from '@core/account'
import { DEFAULT_TRANSACTION_OPTIONS } from '@core/wallet/constants'
import { Output, TransactionData } from '@core/wallet/types'
import { getOutputParameters } from '@core/wallet/utils'

export async function createStardustOutputFromTransactionData(
    transactionData: TransactionData,
    accountIndex: number
): Promise<Output | undefined> {
    try {
        const outputParams = await getOutputParameters(transactionData)
        return prepareOutput(accountIndex, outputParams, DEFAULT_TRANSACTION_OPTIONS)
    } catch (error) {
        console.error(error)
    }
}
