import { formatTokenAmountBestMatch } from '@core/token'
import { ActivityAction, ActivityDirection } from '../../enums'
import { getPersistedToken } from '@core/token/stores'
import { NetworkId } from '@core/network'

export function getFormattedAmountFromActivity(
    rawAmount: bigint,
    tokenId: string,
    networkId: NetworkId,
    direction: ActivityDirection,
    action: ActivityAction,
    signed: boolean = true
): string {
    const metadata = getPersistedToken(networkId, tokenId)?.metadata
    const amount = metadata ? formatTokenAmountBestMatch(rawAmount, metadata) : ''
    return `${
        (direction === ActivityDirection.Outgoing || action === ActivityAction.Burn) && signed ? '- ' : ''
    }${amount}`
}
