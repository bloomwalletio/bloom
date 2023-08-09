import { get } from 'svelte/store'
import { allAccountActivities } from '../stores'
import { activeProfile } from '@core/profile'
import { selectedAccountIndex } from '@core/account'
import { ActivityType } from '../enums'
import { persistedTokens } from '@core/token/stores'
import { updateActivityFromPartialActivity } from '../utils'

export function hideActivitiesForHiddenTokens(): void {
    const tokens = get(persistedTokens)?.[get(activeProfile)?.id]
    allAccountActivities.update((state) => {
        state[get(selectedAccountIndex)].forEach((_activity) => {
            if (_activity.type === ActivityType.Basic || _activity.type === ActivityType.Foundry) {
                const isAssetHidden = !tokens[_activity.assetId] || tokens[_activity.assetId]?.hidden
                updateActivityFromPartialActivity(_activity, { isAssetHidden })
            }
        })
        return state
    })
}
