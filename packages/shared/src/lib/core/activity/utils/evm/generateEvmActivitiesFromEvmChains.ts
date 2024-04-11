import { IAccountState } from '@core/account'
import { getEvmNetworks } from '@core/network'
import { getPersistedTransactionsForChain } from '@core/transactions/stores'
import { EvmActivity } from '../../types'
import { generateEvmActivityFromPersistedTransaction } from './generateEvmActivityFromPersistedTransaction'

export async function generateEvmActivitiesFromEvmChains(
    profileId: string,
    account: IAccountState
): Promise<EvmActivity[]> {
    const activities: EvmActivity[] = []

    for (const evmNetwork of getEvmNetworks()) {
        const persistedTransactions = getPersistedTransactionsForChain(profileId, account.index, evmNetwork)
        for (const persistedTransaction of persistedTransactions) {
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
