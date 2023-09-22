import { ITokenWithBalance } from '@core/token'
import { Activity } from '../types'
import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
import { ActivityType } from '../enums'

export function getTokenFromActivity(activity: Activity): ITokenWithBalance | undefined {
    return activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry
        ? getTokenFromSelectedAccountTokens(
              activity.tokenTransfer?.tokenId ?? activity.baseTokenTransfer.tokenId,
              activity.sourceNetworkId
          )
        : undefined
}
