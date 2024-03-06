import { formatTokenAmountBestMatch } from '@core/token'
import { ActivityAction, ActivityDirection, StardustActivityType } from '../../enums'
import { EvmCoinTransferActivity, StardustFoundryActivity, StardustTransactionActivity } from '../../types'
import { getPersistedToken } from '@core/token/stores'
import { EvmActivityType } from '@core/activity/enums/evm'

export function getFormattedAmountFromActivity(
    activity: StardustTransactionActivity | StardustFoundryActivity | EvmCoinTransferActivity,
    signed: boolean = true
): string {
    if (!activity) return ''

    const transferData =
        activity.type === EvmActivityType.CoinTransfer
            ? activity.baseTokenTransfer
            : activity?.tokenTransfer ?? activity.baseTokenTransfer

    const metadata = getPersistedToken(transferData?.tokenId)?.metadata
    const amount = metadata ? formatTokenAmountBestMatch(transferData.rawAmount, metadata) : undefined
    if (activity.type === StardustActivityType.Basic) {
        return `${
            (activity.direction === ActivityDirection.Outgoing || activity.action === ActivityAction.Burn) && signed
                ? '- '
                : ''
        }${amount}`
    } else {
        return amount ?? '0'
    }
}
