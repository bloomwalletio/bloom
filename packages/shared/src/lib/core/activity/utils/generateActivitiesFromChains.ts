import { IAccountState } from '@core/account'
import { Activity } from '../types'
import { getPersistedEvmTransactions } from '../stores'
import { generateActivityFromEvmTransaction } from './generateActivityFromEvmTransaction'
import { get } from 'svelte/store'
import { network } from '@core/network'

export async function generateActivitiesFromChains(account: IAccountState): Promise<Activity[]> {
    const activities: Activity[] = []

    const chains = get(network)?.getChains() ?? []
    for (const chain of chains) {
        const chainId = chain.getConfiguration().chainId

        const transactions = getPersistedEvmTransactions(account.index, chainId)
        for (const transaction of transactions) {
            const activity = await generateActivityFromEvmTransaction(transaction, chainId, chain.getProvider())
            activities.push(activity)
        }
    }

    return activities
}
