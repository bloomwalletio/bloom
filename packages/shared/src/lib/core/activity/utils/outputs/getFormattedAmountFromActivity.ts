import { getPersistedAsset } from '@core/token/stores'
import { formatTokenAmountBestMatch } from '@core/wallet/utils'
import { ActivityAction, ActivityDirection, ActivityType } from '../../enums'
import { FoundryActivity, TransactionActivity } from '../../types'

export function getFormattedAmountFromActivity(
    activity: TransactionActivity | FoundryActivity,
    signed: boolean = true
): string {
    if (!activity) return ''

    const metadata = getPersistedAsset(activity.assetId)?.metadata
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
