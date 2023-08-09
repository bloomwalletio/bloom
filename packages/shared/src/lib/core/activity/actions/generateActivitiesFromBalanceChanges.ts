import { IAccountState } from '@core/account'
import { Activity } from '../types'
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
        const tokenIds = balanceChanges ? Object.keys(balanceChanges) : []

        for (const tokenId of tokenIds) {
            for (const balanceChangeForAsset of balanceChanges[tokenId]) {
                const activity = generateBalanceChangeActivity(chainId, tokenId, balanceChangeForAsset)
                activities.push(activity)
            }
        }
    }

    return activities
}
