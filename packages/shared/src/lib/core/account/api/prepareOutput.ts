import { OutputParams, TransactionOptions } from '@iota/sdk/out/types'
import { getAccount } from '@core/profile-manager'
import { Output } from '@core/wallet'

export async function prepareOutput(
    accountIndex: number,
    params: OutputParams,
    transactionOptions?: TransactionOptions
): Promise<Output> {
    return (await getAccount(accountIndex))?.prepareOutput(params, transactionOptions) as Promise<Output>
}
