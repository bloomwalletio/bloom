import { formatTokenAmountBestMatch } from '@core/token'
import { ActivityAction, ActivityDirection } from '../../enums'
import { getPersistedToken } from '@core/token/stores'

export function getFormattedAmountFromActivity(
    rawAmount: bigint,
    tokenId: string,
    direction: ActivityDirection,
    action: ActivityAction,
    signed: boolean = true
): string {
    const metadata = getPersistedToken(tokenId)?.metadata
    const amount = metadata ? formatTokenAmountBestMatch(rawAmount, metadata) : undefined
    return `${
        (direction === ActivityDirection.Outgoing || action === ActivityAction.Burn) && signed ? '- ' : ''
    }${amount}`
}
