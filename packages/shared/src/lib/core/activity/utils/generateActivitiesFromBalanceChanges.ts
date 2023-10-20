import { IAccountState } from '@core/account'
import { Activity } from '../types'
import { getBalanceChanges } from '../stores'
import { get } from 'svelte/store'
import { network } from '@core/network'
import { generateBalanceChangeActivity } from './generateBalanceChangeActivity'

export async function generateActivitiesFromBalanceChanges(account: IAccountState): Promise<Activity[]> {
    const activities: Activity[] = []

    const chains = get(network)?.getChains() ?? []
    for (const chain of chains) {
        const networkId = chain.getConfiguration().id
        const balanceChanges = getBalanceChanges(account.index, networkId)
        const tokenIds = balanceChanges ? Object.keys(balanceChanges) : []

        for (const tokenId of tokenIds) {
            for (const balanceChangeForAsset of balanceChanges[tokenId]) {
                if (!balanceChangeForAsset.hidden) {
                    const activity = await generateBalanceChangeActivity(
                        networkId,
                        tokenId,
                        balanceChangeForAsset,
                        account
                    )
                    activities.push(activity)
                }
            }
        }
    }

    return activities
}
