import { formatTokenAmountBestMatch } from '@core/token'
import { ActivityAction, ActivityDirection, ActivityType } from '../../enums'
import { FoundryActivity, TransactionActivity } from '../../types'
import { getPersistedToken } from '@core/token/stores'

export function getFormattedAmountFromActivity(
    activity: TransactionActivity | FoundryActivity,
    signed: boolean = true
): string {
    if (!activity) return ''

    const transferData = activity.tokenTransfer ?? activity.baseTokenTransfer

    const metadata = getPersistedToken(transferData?.tokenId)?.metadata
    const amount = metadata ? formatTokenAmountBestMatch(transferData.rawAmount, metadata) : undefined
    if (activity.type === ActivityType.Basic) {
        return `${
            (activity.direction === ActivityDirection.Outgoing || activity.action === ActivityAction.Burn) && signed
                ? '- '
                : ''
        }${amount}`
    } else {
        return amount ?? '0'
    }
}
