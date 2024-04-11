import { IAccountState } from '@core/account'
import { INftBalanceChange, ITokenBalanceChange, EvmActivity } from '../types'
import { getBalanceChanges } from '../stores'
import { NetworkId, getEvmNetworks } from '@core/network'
import { generateEvmNftBalanceChangeActivity, generateEvmTokenBalanceChangeActivity } from './evm'

export async function generateActivitiesFromBalanceChanges(
    profileId: string,
    account: IAccountState
): Promise<EvmActivity[]> {
    const activities: EvmActivity[] = []

    for (const evmNetwork of getEvmNetworks()) {
        const networkId = evmNetwork.id
        const balanceChanges = getBalanceChanges(profileId, account.index, networkId)

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
                const activity = generateEvmTokenBalanceChangeActivity(
                    networkId,
                    tokenId,
                    balanceChangeForToken,
                    account
                )
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
                const activity = generateEvmNftBalanceChangeActivity(networkId, nftId, balanceChangeForNft, account)
                activities.push(activity)
            } catch (error) {
                console.error(error)
            }
        }
    }
    return activities
}
