import { IAccountState } from '@core/account'
import { FAILED_CONFIRMATION, IEvmNetwork } from '@core/network'
import { getPersistedTransactionsForChain } from '@core/transactions/stores'
import { EvmActivity } from '../../types'
import { generateEvmActivityFromPersistedTransaction } from './generateEvmActivityFromPersistedTransaction'
import { LocalEvmTransaction } from '@core/transactions'
import { startEvmConfirmationPoll } from '@core/wallet'

export async function generateEvmActivitiesFromEvmChain(
    profileId: string,
    network: IEvmNetwork,
    account: IAccountState
): Promise<EvmActivity[]> {
    const activities: EvmActivity[] = []

    const persistedTransactions = getPersistedTransactionsForChain(profileId, account.index, network)
    for (const persistedTransaction of persistedTransactions) {
        const { local } = persistedTransaction
        if (local) {
            updateConfirmationsForEvmTransactions(network, local, account.index, profileId)
        }

        try {
            const activity = await generateEvmActivityFromPersistedTransaction(persistedTransaction, network, account)
            if (activity) {
                activities.push(activity)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return activities
}

function updateConfirmationsForEvmTransactions(
    evmNetwork: IEvmNetwork,
    transaction: LocalEvmTransaction,
    accountIndex: number,
    profileId: string
): void {
    if (transaction.confirmations === FAILED_CONFIRMATION) {
        return
    }

    if (!transaction?.confirmations || transaction.confirmations < evmNetwork.blocksUntilConfirmed) {
        try {
            startEvmConfirmationPoll(transaction, evmNetwork, accountIndex, profileId)
        } catch (error) {
            console.error(error)
        }
    }
}
