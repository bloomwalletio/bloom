import { IAccountState } from '@core/account'
import { INftBalanceChange, ITokenBalanceChange, EvmActivity } from '../types'
import { getBalanceChanges } from '../stores'
import { get } from 'svelte/store'
import { NetworkId, network } from '@core/network'
import { generateNftBalanceChangeActivity, generateTokenBalanceChangeActivity } from './evm'

export async function generateActivitiesFromBalanceChanges(account: IAccountState): Promise<EvmActivity[]> {
    const activities: EvmActivity[] = []

    const chains = get(network)?.getChains() ?? []
    for (const chain of chains) {
        const networkId = chain.getConfiguration().id
        const balanceChanges = getBalanceChanges(account.index, networkId)

        const tokenActivities = await generateActivitiesFromTokenBalanceChanges(
            account,
            networkId,
            balanceChanges.tokens
        )
        activities.push(...tokenActivities)
        const nftActivities = generateActivitiesFromNftBalanceChanges(account, networkId, balanceChanges.nfts)
        activities.push(...nftActivities)
    }

    return activities
}

export async function generateActivitiesFromTokenBalanceChanges(
    account: IAccountState,
    networkId: NetworkId,
    tokenBalanceChanges: {
        [tokenId: string]: ITokenBalanceChange[]
    }
): Promise<EvmActivity[]> {
    const activities: EvmActivity[] = []
    const tokenIds = tokenBalanceChanges ? Object.keys(tokenBalanceChanges) : []
    for (const tokenId of tokenIds) {
        for (const balanceChangeForToken of tokenBalanceChanges[tokenId]) {
            if (balanceChangeForToken.hidden) {
                continue
            }
            try {
                const activity = generateTokenBalanceChangeActivity(networkId, tokenId, balanceChangeForToken, account)
                activities.push(activity)
            } catch (error) {
                console.error(error)
            }
        }
    }
    return Promise.resolve(activities)
}

export function generateActivitiesFromNftBalanceChanges(
    account: IAccountState,
    networkId: NetworkId,
    nftBalanceChanges: {
        [nftId: string]: INftBalanceChange[]
    }
): EvmActivity[] {
    const activities: EvmActivity[] = []
    const nftIds = nftBalanceChanges ? Object.keys(nftBalanceChanges) : []
    for (const nftId of nftIds) {
        for (const balanceChangeForNft of nftBalanceChanges[nftId]) {
            if (balanceChangeForNft.hidden) {
                continue
            }
            try {
                const activity = generateNftBalanceChangeActivity(networkId, nftId, balanceChangeForNft, account)
                activities.push(activity)
            } catch (error) {
                console.error(error)
            }
        }
    }
    return activities
}
