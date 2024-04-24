import { IAccountState } from '@core/account'
import { IPersistedToken } from '@core/token/interfaces'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { addPersistedToken } from '@core/token/stores'
import { get } from 'svelte/store'
import { StardustActivityType } from '../enums'
import { allAccountActivities } from '../stores'
import { NetworkId } from '@core/network/types'

export async function loadAssetsForAllActivities(account: IAccountState): Promise<void> {
    const accountActivities = get(allAccountActivities)[account.index]

    const persistedTokens: { [networkId: NetworkId]: IPersistedToken[] } = {}
    for (const activity of accountActivities) {
        try {
            if (activity.type === StardustActivityType.Basic || activity.type === StardustActivityType.Foundry) {
                const tokenId = activity.tokenTransfer?.tokenId ?? activity.baseTokenTransfer?.tokenId
                const token = await getOrRequestTokenFromPersistedTokens(tokenId, activity.sourceNetworkId, false)
                if (token) {
                    if (!persistedTokens[activity.sourceNetworkId]) {
                        persistedTokens[activity.sourceNetworkId] = []
                    }
                    persistedTokens[activity.sourceNetworkId].push(token)
                }
            }
        } catch (err) {
            console.error(err)
        }
    }

    for (const networkId of Object.keys(persistedTokens)) {
        addPersistedToken(networkId as NetworkId, ...persistedTokens[networkId])
    }
}
