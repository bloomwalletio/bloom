import { prepareOutput } from '@core/account'
import { getOutputParameters } from './getOutputParameters'
import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'
import { Output, TransactionData } from '../types'

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
