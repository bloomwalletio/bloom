import { ITokenWithBalance } from '@core/token'
import { Activity } from '../types'
import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
import { getTokenIdFromActivity } from './getTokenIdFromActivity'

export function getTokenFromActivity(activity: Activity): ITokenWithBalance | undefined {
    const tokenId = getTokenIdFromActivity(activity)
    if (!tokenId) {
        return undefined
    }

    return getTokenFromSelectedAccountTokens(tokenId, activity.sourceNetworkId)
}
