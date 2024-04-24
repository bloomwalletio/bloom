import { IAccountState } from '@core/account'
import { IPersistedToken } from '@core/token/interfaces'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { addPersistedToken } from '@core/token/stores'
import { get } from 'svelte/store'
import { allAccountActivities } from '../stores'
import { NetworkId } from '@core/network/types'
import { getTokenIdFromActivity } from '../utils'

export async function loadAssetsForAllActivities(account: IAccountState): Promise<void> {
    const accountActivities = get(allAccountActivities)[account.index]

    const tokens: { [networkId: NetworkId]: IPersistedToken[] } = {}
    for (const activity of accountActivities) {
        try {
            const tokenId = getTokenIdFromActivity(activity)
            if (!tokenId) {
                continue
            }

            const token = await getOrRequestTokenFromPersistedTokens(tokenId, activity.sourceNetworkId, false)
            if (token) {
                if (!tokens[activity.sourceNetworkId]) {
                    tokens[activity.sourceNetworkId] = []
                }
                tokens[activity.sourceNetworkId].push(token)
            }
        } catch (err) {
            console.error(err)
        }
    }

    for (const networkId of Object.keys(tokens)) {
        addPersistedToken(networkId as NetworkId, ...tokens[networkId])
    }
}
