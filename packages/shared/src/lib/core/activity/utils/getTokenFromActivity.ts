import { BASE_TOKEN_ID, ITokenWithBalance } from '@core/token'
import { StardustActivity } from '../types'
import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
import { ActivityType } from '../enums'

export function getTokenFromActivity(activity: StardustActivity): ITokenWithBalance | undefined {
    if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
        return getTokenFromSelectedAccountTokens(
            activity.tokenTransfer?.tokenId ?? activity.baseTokenTransfer.tokenId,
            activity.sourceNetworkId
        )
    } else if (activity.type === ActivityType.Governance || activity.type === ActivityType.Consolidation) {
        return getTokenFromSelectedAccountTokens(BASE_TOKEN_ID, activity.sourceNetworkId)
    } else {
        return undefined
    }
}
