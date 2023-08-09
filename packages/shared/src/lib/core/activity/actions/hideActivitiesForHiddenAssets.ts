import { get } from 'svelte/store'
import { allAccountActivities } from '../stores'
import { activeProfile } from '@core/profile'
import { selectedAccountIndex } from '@core/account'
import { ActivityType } from '../enums'
import { persistedTokens } from '@core/token/stores'
import { updateActivityFromPartialActivity } from '../utils'

export function hideActivitiesForHiddenAssets(): void {
    const assets = get(persistedTokens)?.[get(activeProfile)?.id]
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
