import { ITokenWithBalance } from '@core/token/interfaces'
import { calculateFiatValueFromTokenAmountAndMarketPrice } from '../utils'
import { getMarketPriceForToken } from './getMarketPriceForToken'

export function getFiatValueFromTokenAmount(
    tokenAmount: bigint | undefined,
    token: ITokenWithBalance
): string | undefined {
    const marketPrice = getMarketPriceForToken(token)
    if (tokenAmount === undefined || marketPrice === undefined) {
        return undefined
    }

    try {
        const fiatValue = calculateFiatValueFromTokenAmountAndMarketPrice(
            tokenAmount,
            token?.metadata?.decimals,
            marketPrice
        )
        return fiatValue
    } catch {
        return undefined
    }
}
