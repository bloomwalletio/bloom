import { IAccountState } from '@core/account/interfaces'
import { IChain } from '@core/network'
import { PersistedTransaction } from '@core/transactions'
import { EvmActivity } from '../../types'
import { generateEvmActivityFromBlockscoutTransaction } from './generateEvmActivityFromBlockscoutTransaction'
import { generateEvmActivityFromLocalEvmTransaction } from './generateEvmActivityFromLocalEvmTransaction'
import { generateEvmTokenTransferActivityFromBlockscoutTokenTransfer } from './generateEvmTokenTransferActivityFromBlockscoutTokenTransfer'

export async function generateEvmActivityFromPersistedTransaction(
    persistedTransaction: PersistedTransaction,
    chain: IChain,
    account: IAccountState
): Promise<EvmActivity | undefined> {
    const { local, blockscout, tokenTransfer } = persistedTransaction

    if (tokenTransfer) {
        const r = generateEvmTokenTransferActivityFromBlockscoutTokenTransfer(tokenTransfer, blockscout, chain, account)
        return r
    } else if (blockscout) {
        return await generateEvmActivityFromBlockscoutTransaction(blockscout, chain, account)
    } else if (local) {
        return await generateEvmActivityFromLocalEvmTransaction(local, chain, account)
    }
}
