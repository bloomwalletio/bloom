import { NetworkId } from '@core/network'
import { IExtendedTokenBalance } from '..'
import { getTokenFromSelectedAccountTokens } from '../stores'

export function getTokenBalance(tokenId: string, networkId: NetworkId): IExtendedTokenBalance | undefined {
    const token = getTokenFromSelectedAccountTokens(tokenId, networkId)
    return token?.balance
}
