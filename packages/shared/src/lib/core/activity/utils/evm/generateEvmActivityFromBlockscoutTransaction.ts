import { BlockscoutTransactionType, IBlockscoutTransaction } from '@auxiliary/blockscout'
import { IAccountState } from '@core/account'
import { EvmActivity } from '@core/activity/types'
import { IChain } from '@core/network'
import { buildPersistedEvmTransactionFromBlockscoutTransaction } from '@core/transactions'
import { generateEvmActivityFromLocalEvmTransaction } from './generateEvmActivityFromLocalEvmTransaction'

export async function generateEvmActivityFromBlockscoutTransaction(
    blockscoutTransaction: IBlockscoutTransaction,
    chain: IChain,
    account: IAccountState
): Promise<EvmActivity | undefined> {
    if (blockscoutTransaction.tx_types[0] === BlockscoutTransactionType.CoinTransfer) {
        // i.e must be a coin transfer
        const localTransaction = buildPersistedEvmTransactionFromBlockscoutTransaction(blockscoutTransaction)
        return generateEvmActivityFromLocalEvmTransaction(localTransaction, chain, account)
    }
    return Promise.resolve(undefined)
}
