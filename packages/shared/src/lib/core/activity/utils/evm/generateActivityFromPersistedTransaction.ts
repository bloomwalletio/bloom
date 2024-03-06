import { IAccountState } from '@core/account/interfaces'
import { IChain } from '@core/network'
import { PersistedTransaction } from '@core/transactions'
import { EvmActivity } from '../../types'
import { generateEvmActivityFromBlockscoutTransaction } from './generateEvmActivityFromBlockscoutTransaction'
import { generateEvmActivityFromLocalEvmTransaction } from './generateEvmActivityFromLocalEvmTransaction'

export async function generateActivityFromPersistedTransaction(
    persistedTransaction: PersistedTransaction,
    chain: IChain,
    account: IAccountState
): Promise<EvmActivity | undefined> {
    const { local, blockscout } = persistedTransaction

    // if (tokenTransfer) {
    //     return
    // } else if (blockscout) {
    if (blockscout) {
        return await generateEvmActivityFromBlockscoutTransaction(blockscout, chain, account)
    } else if (local) {
        return await generateEvmActivityFromLocalEvmTransaction(local, chain, account)
    }
}
