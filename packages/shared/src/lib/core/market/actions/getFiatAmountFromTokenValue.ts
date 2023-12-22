import { ITokenWithBalance } from '@core/token/interfaces'
import { calculateFiatValueFromTokenValueAndMarketPrice } from '../utils'
import { getMarketPriceForToken } from './getMarketPriceForToken'

export function getFiatAmountFromTokenValue(
    tokenValue: bigint | undefined,
    token: ITokenWithBalance
): bigint | undefined {
    const marketPrice = getMarketPriceForToken(token)

    if (tokenValue === undefined || marketPrice === undefined) {
        return undefined
    }

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
