import { BASE_TOKEN_ID, ITokenWithBalance } from '@core/token'
import { StardustActivity } from '../types'
import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
import { StardustActivityType } from '../enums'

export function getTokenFromActivity(activity: StardustActivity): ITokenWithBalance | undefined {
    if (activity.type === StardustActivityType.Basic || activity.type === StardustActivityType.Foundry) {
        return getTokenFromSelectedAccountTokens(
            activity.tokenTransfer?.tokenId ?? activity.baseTokenTransfer.tokenId,
            activity.sourceNetworkId
        )
    } else if (
        activity.type === StardustActivityType.Governance ||
        activity.type === StardustActivityType.Consolidation
    ) {
        return getTokenFromSelectedAccountTokens(BASE_TOKEN_ID, activity.sourceNetworkId)
    } else {
        return undefined
    }
}
