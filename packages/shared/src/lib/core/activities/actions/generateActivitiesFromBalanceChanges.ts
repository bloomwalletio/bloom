import { IAccountState } from '@core/account'
import { Activity } from '@core/wallet/types'
import { getBalanceChanges } from '../stores'
import { get } from 'svelte/store'
import { network } from '@core/network'
import { generateBalanceChangeActivity } from '../utils'

export function generateActivitiesFromBalanceChanges(account: IAccountState): Activity[] {
    const activities: Activity[] = []

    const chains = get(network)?.getChains() ?? []
    for (const chain of chains) {
        const chainId = chain.getConfiguration().chainId
        const balanceChanges = getBalanceChanges(account.index, chainId)
        const assetIds = Object.keys(balanceChanges)

        for (const assetId of assetIds) {
            const balanceChangesForAsset = balanceChanges[assetId]

            for (const balanceChangeForAsset of balanceChangesForAsset) {
                const activity = generateBalanceChangeActivity(chainId, assetId, balanceChangeForAsset)
                activities.push(activity)
            }
        }
    }

    return activities
}
