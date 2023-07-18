import { prepareOutput } from '@core/account'
import { getOutputParameters } from './getOutputParameters'
import { get } from 'svelte/store'
import { newTransactionData } from '../stores'
import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'
import { Output } from '../types'

export async function prepareOutputFromTransactionData(accountIndex: number): Promise<Output | undefined> {
    const transactionData = get(newTransactionData)
    if (!transactionData) {
        return
    }

    try {
        const outputParams = await getOutputParameters(transactionData)
        return prepareOutput(accountIndex, outputParams, DEFAULT_TRANSACTION_OPTIONS)
    } catch (error) {
        console.error(error)
    }
}
