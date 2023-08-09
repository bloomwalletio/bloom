import { IAccountState } from '@core/account'
import { IPersistedToken } from '@core/token'
import { getOrRequestTokenFromPersistedTokens } from '@core/token/actions'
import { addPersistedAsset } from '@core/token/stores'
import { get } from 'svelte/store'
import { ActivityType } from '../enums'
import { allAccountActivities } from '../stores'

export async function loadAssetsForAllActivities(account: IAccountState): Promise<void> {
    const accountActivities = get(allAccountActivities)[account.index]

    const persistedTokens: IPersistedToken[] = []
    for (const activity of accountActivities) {
        try {
            if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
                const asset = await getOrRequestTokenFromPersistedTokens(activity.assetId)
                if (asset) {
                    persistedTokens.push(asset)
                }
            }
        } catch (err) {
            console.error(err)
        }
    }
    addPersistedAsset(...persistedTokens)
}
