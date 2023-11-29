import { NetworkId } from '@core/network'
import { ITokenBalance } from '..'
import { getTokenFromSelectedAccountTokens } from '../stores'

export function getTokenBalance(tokenId: string, networkId: NetworkId): ITokenBalance | undefined {
    const token = getTokenFromSelectedAccountTokens(tokenId, networkId)
    return token?.balance
}
