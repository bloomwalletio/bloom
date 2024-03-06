import { IAccountState } from '@core/account'
import { EvmActivityType } from '@core/activity/enums/evm'
import { EvmActivity, EvmCoinTransferActivity } from '@core/activity/types'
import { IChain } from '@core/network'
import { LocalEvmTransaction } from '@core/transactions'
import { generateBaseEvmActivity } from './generateBaseEvmActivity'

export async function generateEvmActivityFromLocalEvmTransaction(
    transaction: LocalEvmTransaction,
    chain: IChain,
    account: IAccountState
): Promise<EvmActivity | undefined> {
    if (!transaction.data) {
        // i.e must be a coin transfer
        const baseActivity = await generateBaseEvmActivity(transaction, chain, transaction.to, account)

        return {
            ...baseActivity,
            type: EvmActivityType.CoinTransfer,
            rawAmount: transaction.value,
        } as EvmCoinTransferActivity
    }

    return Promise.resolve(undefined)
}
