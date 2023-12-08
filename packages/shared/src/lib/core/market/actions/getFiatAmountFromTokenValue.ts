import { ITokenWithBalance } from '@core/token/interfaces'
import { calculateFiatValueFromTokenValueAndMarketPrice } from '../utils'
import { getMarketPriceForToken } from './getMarketPriceForToken'

export function getFiatAmountFromTokenValue(tokenValue: number, token: ITokenWithBalance): number | undefined {
    const marketPrice = getMarketPriceForToken(token)

    try {
        const fiatAmount = calculateFiatValueFromTokenValueAndMarketPrice(
            tokenValue,
            token?.metadata?.decimals,
            marketPrice
        )
        return fiatAmount
    } catch {
        return undefined
    }
}
