import { IAccountState } from '@core/account'
import { get } from 'svelte/store'
import { ActivityType } from '../enums'
import { allAccountActivities } from '../stores'
import { IPersistedAsset } from '@core/wallet/interfaces'
import { addPersistedAsset } from '@core/wallet/stores'
import { getOrRequestAssetFromPersistedAssets } from '@core/wallet/actions'

export async function loadAssetsForAllActivities(account: IAccountState): Promise<void> {
    const accountActivities = get(allAccountActivities)[account.index]

    const persistedAssets: IPersistedAsset[] = []
    for (const activity of accountActivities) {
        try {
            if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
                const asset = await getOrRequestAssetFromPersistedAssets(activity.assetId)
                if (asset) {
                    persistedAssets.push(asset)
                }
            }
        } catch (err) {
            console.error(err)
        }
    }
    addPersistedAsset(...persistedAssets)
}
