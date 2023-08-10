import { selectedAccountIndex } from '@core/account'
import { activeProfile } from '@core/profile/stores'
import { persistedAssets } from '@core/wallet/stores'
import { get } from 'svelte/store'
import { ActivityType } from '../enums'
import { allAccountActivities } from '../stores'
import { updateActivityFromPartialActivity } from '../utils'

export function hideActivitiesForHiddenAssets(): void {
    const assets = get(persistedAssets)?.[get(activeProfile)?.id]
    allAccountActivities.update((state) => {
        state[get(selectedAccountIndex)].forEach((_activity) => {
            if (_activity.type === ActivityType.Basic || _activity.type === ActivityType.Foundry) {
                const isAssetHidden = !assets[_activity.assetId] || assets[_activity.assetId]?.hidden
                updateActivityFromPartialActivity(_activity, { isAssetHidden })
            }
        })
        return state
    })
}
