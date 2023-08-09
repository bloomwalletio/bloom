import { formatTokenAmountBestMatch } from '@core/token'
import { getPersistedToken } from '@core/token/stores'
import { ActivityAction, ActivityDirection, ActivityType } from '../../enums'
import { FoundryActivity, TransactionActivity } from '../../types'

export function getFormattedAmountFromActivity(
    activity: TransactionActivity | FoundryActivity,
    signed: boolean = true
): string {
    if (!activity) return ''

    const metadata = getPersistedToken(activity.tokenId)?.metadata
    const amount = formatTokenAmountBestMatch(activity.rawAmount, metadata, 2)
    if (activity.type === ActivityType.Basic) {
        return `${
            (activity.direction === ActivityDirection.Outgoing || activity.action === ActivityAction.Burn) && signed
                ? '- '
                : ''
        }${amount}`
    } else {
        return amount
    }
}
