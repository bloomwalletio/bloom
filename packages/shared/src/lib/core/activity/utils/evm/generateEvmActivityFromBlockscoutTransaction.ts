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
    if (
        blockscoutTransaction.tx_types.includes(BlockscoutTransactionType.CoinTransfer) ||
        blockscoutTransaction.tx_types.includes(BlockscoutTransactionType.TokenTransfer)
    ) {
        // TODO: use blockscout data to generate activity
        const localTransaction = buildPersistedEvmTransactionFromBlockscoutTransaction(blockscoutTransaction)
        return generateEvmActivityFromLocalEvmTransaction(localTransaction, chain, account)
    } else {
        const localTransaction = buildPersistedEvmTransactionFromBlockscoutTransaction(blockscoutTransaction)
        return generateEvmActivityFromLocalEvmTransaction(localTransaction, chain, account)
    }
}
