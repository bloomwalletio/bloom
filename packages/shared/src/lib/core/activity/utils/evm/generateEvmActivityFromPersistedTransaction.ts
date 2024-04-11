import { IAccountState } from '@core/account/interfaces'
import { IEvmNetwork } from '@core/network'
import { PersistedTransaction } from '@core/transactions'
import { EvmActivity } from '../../types'
import { generateEvmActivityFromBlockscoutTransaction } from './generateEvmActivityFromBlockscoutTransaction'
import { generateEvmActivityFromLocalEvmTransaction } from './generateEvmActivityFromLocalEvmTransaction'
import { generateEvmTokenTransferActivityFromBlockscoutTokenTransfer } from './generateEvmTokenTransferActivityFromBlockscoutTokenTransfer'

export async function generateEvmActivityFromPersistedTransaction(
    persistedTransaction: PersistedTransaction,
    evmNetwork: IEvmNetwork,
    account: IAccountState
): Promise<EvmActivity | undefined> {
    const { local, blockscout, tokenTransfer } = persistedTransaction

    if (tokenTransfer) {
        return generateEvmTokenTransferActivityFromBlockscoutTokenTransfer(tokenTransfer, blockscout, evmNetwork, account)
    } else if (blockscout) {
        return generateEvmActivityFromBlockscoutTransaction(blockscout, local, evmNetwork, account)
    } else if (local) {
        return generateEvmActivityFromLocalEvmTransaction(local, evmNetwork, account)
    }
}
