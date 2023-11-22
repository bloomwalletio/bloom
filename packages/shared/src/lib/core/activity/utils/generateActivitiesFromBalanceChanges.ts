import { IAccountState } from '@core/account'
import { Activity, INftBalanceChange, ITokenBalanceChange } from '../types'
import { getBalanceChanges } from '../stores'
import { get } from 'svelte/store'
import { NetworkId, network } from '@core/network'
import { generateNftBalanceChangeActivity, generateTokenBalanceChangeActivity } from './evm'
import { hasTokenBeenUntracked } from '@core/wallet/actions'

export async function generateActivitiesFromBalanceChanges(account: IAccountState): Promise<Activity[]> {
    const activities: Activity[] = []

    const chains = get(network)?.getChains() ?? []
    for (const chain of chains) {
        const networkId = chain.getConfiguration().id
        const balanceChanges = getBalanceChanges(account.index, networkId)

        const tokenActivites = await generateActivitiesFromTokenBalanceChanges(
            account,
            networkId,
            balanceChanges.tokens
        )
        activities.push(...tokenActivites)
        const nftActivites = generateActivitiesFromNftBalanceChanges(account, networkId, balanceChanges.nfts)
        activities.push(...nftActivites)
    }

    return activities
}

export async function generateActivitiesFromTokenBalanceChanges(
    account: IAccountState,
    networkId: NetworkId,
    tokenBalanceChanges: {
        [tokenId: string]: ITokenBalanceChange[]
    }
): Promise<Activity[]> {
    const activities: Activity[] = []
    const tokenIds = tokenBalanceChanges ? Object.keys(tokenBalanceChanges) : []
    for (const tokenId of tokenIds) {
        const _hasTokenBeenUntracked = hasTokenBeenUntracked(tokenId, networkId)
        for (const balanceChangeForToken of tokenBalanceChanges[tokenId]) {
            if (!balanceChangeForToken.hidden) {
                const activity = await generateTokenBalanceChangeActivity(
                    networkId,
                    tokenId,
                    balanceChangeForToken,
                    account,
                    _hasTokenBeenUntracked
                )
                activities.push(activity)
            }
        }
    }
    return activities
}

export function generateActivitiesFromNftBalanceChanges(
    account: IAccountState,
    networkId: NetworkId,
    nftBalanceChanges: {
        [nftId: string]: INftBalanceChange[]
    }
): Activity[] {
    const activities: Activity[] = []
    const nftIds = nftBalanceChanges ? Object.keys(nftBalanceChanges) : []
    for (const nftId of nftIds) {
        for (const balanceChangeForNft of nftBalanceChanges[nftId]) {
            if (!balanceChangeForNft.hidden) {
                const activity = generateNftBalanceChangeActivity(networkId, nftId, balanceChangeForNft, account)
                activities.push(activity)
            }
        }
    }
    return activities
}
