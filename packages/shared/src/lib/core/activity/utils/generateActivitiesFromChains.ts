import { IAccountState } from '@core/account'
import { Activity } from '../types'
import { getPersistedEvmTransactions } from '../stores'
import { generateActivityFromEvmTransaction } from './generateActivityFromEvmTransaction'
import { get } from 'svelte/store'
import { network } from '@core/network'
import { BASE_TOKEN_ID } from '@core/token'

export async function generateActivitiesFromChains(account: IAccountState): Promise<Activity[]> {
    const activities: Activity[] = []

    const chains = get(network)?.getChains() ?? []
    for (const chain of chains) {
        const networkId = chain.getConfiguration().id

        const transactions = getPersistedEvmTransactions(account.index, networkId)
        for (const transaction of transactions) {
            // TODO: We need to store additional information on the EVM transaction such as `tokenId` because we cannot easily extract that from transaction data
            const activity = await generateActivityFromEvmTransaction(
                transaction,
                BASE_TOKEN_ID,
                networkId,
                chain.getProvider()
            )
            activities.push(activity)
        }
    }

    return activities
}
