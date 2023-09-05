import { IAccountState } from '@core/account'
import { IPersistedToken } from '@core/token/interfaces'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { addPersistedToken } from '@core/token/stores'
import { get } from 'svelte/store'
import { ActivityType } from '../enums'
import { allAccountActivities } from '../stores'

export async function loadAssetsForAllActivities(account: IAccountState): Promise<void> {
    const accountActivities = get(allAccountActivities)[account.index]

    const persistedTokens: IPersistedToken[] = []
    for (const activity of accountActivities) {
        try {
            if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
                const tokenId = activity.tokenTransfer?.token.id ?? activity.baseTokenTransfer?.token.id
                const token = await getOrRequestTokenFromPersistedTokens(tokenId)
                if (token) {
                    persistedTokens.push(token)
                }
            }
        } catch (err) {
            console.error(err)
        }
    }
    addPersistedToken(...persistedTokens)
}
