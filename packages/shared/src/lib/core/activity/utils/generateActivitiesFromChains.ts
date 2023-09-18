import { get } from 'svelte/store'
import { IAccountState } from '@core/account'
import { network } from '@core/network'
import { getPersistedEvmTransactions } from '../stores'
import { Activity } from '../types'
import { generateActivityFromEvmTransaction } from './generateActivityFromEvmTransaction'

export async function generateActivitiesFromChains(account: IAccountState): Promise<Activity[]> {
    const activities: Activity[] = []

    const chains = get(network)?.getChains() ?? []
    for (const chain of chains) {
        const networkId = chain.getConfiguration().id

        const transactions = getPersistedEvmTransactions(account.index, networkId)
        for (const transaction of transactions) {
            const activity = await generateActivityFromEvmTransaction(transaction, networkId, chain)
            activities.push(activity)
        }
    }

    return activities
}
