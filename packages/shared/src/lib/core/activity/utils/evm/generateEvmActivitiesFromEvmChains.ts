import { IAccountState } from '@core/account'
import { network } from '@core/network'
import { getPersistedTransactionsForChain } from '@core/transactions/stores'
import { get } from 'svelte/store'
import { EvmActivity } from '../../types'
import { generateEvmActivityFromPersistedTransaction } from './generateEvmActivityFromPersistedTransaction'

export async function generateEvmActivitiesFromEvmChains(
    profileId: string,
    account: IAccountState
): Promise<EvmActivity[]> {
    const activities: EvmActivity[] = []

    const chains = get(network)?.getChains() ?? []
    for (const chain of chains) {
        const persistedTransactions = getPersistedTransactionsForChain(profileId, account.index, chain)
        for (const persistedTransaction of persistedTransactions) {
            try {
                const activity = await generateEvmActivityFromPersistedTransaction(persistedTransaction, chain, account)
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
