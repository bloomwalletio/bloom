import { BASE_TOKEN_ID, TokenStandard } from '@core/token'
import { Activity } from '../types'
import { StardustActivityType } from '../enums'
import { NetworkNamespace } from '@core/network'
import { EvmActivityType } from '../enums/evm'
import { isEvmTokenActivity } from './isEvmTokenActivity'

export function getTokenIdFromActivity(activity: Activity): string | undefined {
    if (activity.namespace === NetworkNamespace.Stardust) {
        if (activity.type === StardustActivityType.Basic || activity.type === StardustActivityType.Foundry) {
            return activity.tokenTransfer?.tokenId ?? activity.baseTokenTransfer.tokenId
        } else if (
            activity.type === StardustActivityType.Governance ||
            activity.type === StardustActivityType.Consolidation
        ) {
            return BASE_TOKEN_ID
        } else {
            return undefined
        }
    } else if (activity.namespace === NetworkNamespace.Evm) {
        if (activity.type === EvmActivityType.CoinTransfer) {
            return BASE_TOKEN_ID
        } else if (isEvmTokenActivity(activity)) {
            if (
                activity.tokenTransfer.standard === TokenStandard.Erc20 ||
                activity.tokenTransfer.standard === TokenStandard.Irc30
            ) {
                return activity.tokenTransfer.tokenId
            } else {
                return undefined
            }
        } else {
            return undefined
        }
    } else {
        return undefined
    }
}
