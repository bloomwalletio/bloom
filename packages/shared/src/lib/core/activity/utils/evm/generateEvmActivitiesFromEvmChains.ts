import { IAccountState } from '@core/account'
import { FAILED_CONFIRMATION, getEvmNetworks, IEvmNetwork } from '@core/network'
import { getPersistedTransactionsForChain } from '@core/transactions/stores'
import { EvmActivity } from '../../types'
import { generateEvmActivityFromPersistedTransaction } from './generateEvmActivityFromPersistedTransaction'
import { LocalEvmTransaction } from '@core/transactions'
import { startEvmConfirmationPoll } from '@core/wallet'

export async function generateEvmActivitiesFromEvmChains(
    profileId: string,
    account: IAccountState
): Promise<EvmActivity[]> {
    const activities: EvmActivity[] = []

    for (const evmNetwork of getEvmNetworks()) {
        const persistedTransactions = getPersistedTransactionsForChain(profileId, account.index, evmNetwork)
        for (const persistedTransaction of persistedTransactions) {
            const { local } = persistedTransaction
            if (local) {
                updateConfirmationsForEvmTransactions(evmNetwork, local, account.index, profileId)
            }

            try {
                const activity = await generateEvmActivityFromPersistedTransaction(
                    persistedTransaction,
                    evmNetwork,
                    account
                )
                if (activity) {
                    activities.push(activity)
                }
            } catch (error) {
                console.error(error)
            }
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
