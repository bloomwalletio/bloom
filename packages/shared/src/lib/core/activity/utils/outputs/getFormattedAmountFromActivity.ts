import { formatTokenAmount } from '@core/token'
import { ActivityAction, ActivityDirection } from '../../enums'
import { getPersistedToken } from '@core/token/stores'
import { Activity } from '@core/activity/types'

export function getFormattedAmountFromActivity(
    rawAmount: bigint,
    tokenId: string,
    activity: Activity,
    signed: boolean = true
): string {
    const metadata = getPersistedToken(activity.sourceNetworkId, tokenId)?.metadata
    const amount = metadata ? formatTokenAmount(rawAmount, metadata) : ''
    return `${
        (activity.direction === ActivityDirection.Outgoing || activity.action === ActivityAction.Burn) && signed
            ? '- '
            : ''
    }${amount}`
}
