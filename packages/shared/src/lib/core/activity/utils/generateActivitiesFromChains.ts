import { IAccountState } from '@core/account'
import { network } from '@core/network'
import { getPersistedTransactionsForChain } from '@core/transactions/stores'
import { get } from 'svelte/store'
import { Activity } from '../types'
import { generateActivityFromPersistedTransaction } from './generateActivityFromPeristedTransaction'

export async function generateActivitiesFromChains(profileId: string, account: IAccountState): Promise<Activity[]> {
    const activities: Activity[] = []

    const chains = get(network)?.getChains() ?? []
    for (const chain of chains) {
        const persistedTransactions = getPersistedTransactionsForChain(profileId, account.index, chain)
        for (const persistedTransaction of persistedTransactions) {
            try {
                // TODO: build activities from persisted transactions
                const activity = await generateActivityFromPersistedTransaction(persistedTransaction, chain, account)
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
