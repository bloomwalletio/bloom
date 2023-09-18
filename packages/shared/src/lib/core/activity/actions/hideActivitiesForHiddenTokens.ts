import { get } from 'svelte/store'
import { selectedAccountIndex } from '@core/account/stores'
import { activeProfile } from '@core/profile/stores'
import { BASE_TOKEN_ID } from '@core/token/constants'
import { persistedTokens } from '@core/token/stores'
import { ActivityType } from '../enums'
import { allAccountActivities } from '../stores'
import { updateActivityFromPartialActivity } from '../utils'

export function hideActivitiesForHiddenTokens(): void {
    const tokens = get(persistedTokens)?.[get(activeProfile)?.id]
    allAccountActivities.update((state) => {
        state[get(selectedAccountIndex)].forEach((_activity) => {
            if (_activity.type === ActivityType.Basic || _activity.type === ActivityType.Foundry) {
                const tokenId = _activity.tokenTransfer?.tokenId ?? BASE_TOKEN_ID
                const isTokenHidden = !tokens[tokenId] || tokens[tokenId]?.hidden
                updateActivityFromPartialActivity(_activity, { type: _activity.type, isTokenHidden })
            }
        })
        return state
    })
}
