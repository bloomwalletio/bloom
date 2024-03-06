import { BASE_TOKEN_ID, ITokenWithBalance } from '@core/token'
import { Activity } from '../types'
import { getTokenFromSelectedAccountTokens } from '@core/token/stores'
import { StardustActivityType } from '../enums'
import { NetworkNamespace } from '@core/network'
import { EvmActivityType } from '../enums/evm'

export function getTokenFromActivity(activity: Activity): ITokenWithBalance | undefined {
    if (activity.namespace === NetworkNamespace.Stardust) {
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
    } else if (activity.namespace === NetworkNamespace.Evm) {
        if (activity.type === EvmActivityType.CoinTransfer) {
            return getTokenFromSelectedAccountTokens(BASE_TOKEN_ID, activity.sourceNetworkId)
        } else {
            return undefined
        }
    } else {
        return undefined
    }
}
