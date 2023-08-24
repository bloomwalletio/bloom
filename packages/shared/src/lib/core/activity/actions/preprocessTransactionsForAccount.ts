import { IAccountState } from '@core/account'
import { preprocessTransaction } from '../utils/outputs'
import { IProcessedTransaction } from '../types'

export async function preprocessTransactionsForAccount(account: IAccountState): Promise<IProcessedTransaction[]> {
    const transactions = await account.transactions()

    const processedTransactions: IProcessedTransaction[] = []

    for (const transaction of transactions) {
        try {
            const processedTransaction = await preprocessTransaction(transaction, account)
            processedTransactions.push(processedTransaction)
        } catch (err) {
            console.error(err)
        }
    }
    return processedTransactions
}
