import { plainToInstance } from 'class-transformer'
import { PreparedTransaction, Transaction } from '@iota/sdk/out/types'

export function sendPreparedTransaction(preparedTransaction: PreparedTransaction): Promise<Transaction> {
    const preparedTransactionInstance = plainToInstance(PreparedTransaction, preparedTransaction)
    return preparedTransactionInstance.send()
}
