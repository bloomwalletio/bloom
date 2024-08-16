import { ITokenWithBalance } from '@core/token/interfaces'
import { getMarketPriceForToken } from './getMarketPriceForToken'
import { MarketCurrency } from '../types'

export function getTokenValueFromFiatAmount(
    fiatValue: string | undefined,
    token: ITokenWithBalance,
    marketCurrency?: MarketCurrency
): bigint | undefined {
    if (fiatValue === undefined) return undefined

    const marketPrice = getMarketPriceForToken(token, marketCurrency)
    if (marketPrice === undefined) return undefined

    try {
        const fiatValueNumber = parseFloat(fiatValue)
        if (isNaN(fiatValueNumber)) return undefined

        const tokenDecimals = token?.metadata?.decimals || 0
        const marketPriceNumber = parseFloat(marketPrice)
        if (isNaN(marketPriceNumber)) return undefined

        // Calculate the token amount: fiatValue / marketPrice * 10^tokenDecimals
        const tokenAmount = (fiatValueNumber / marketPriceNumber) * Math.pow(10, tokenDecimals)
        return BigInt(Math.floor(tokenAmount))
    } catch {
        return undefined
    }
}
