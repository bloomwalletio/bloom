import { ITokenWithBalance } from '@core/token/interfaces'
import { getMarketPriceForToken } from './getMarketPriceForToken'

export function getFiatAmountFromTokenValue(tokenAmount: number, token: ITokenWithBalance): number | undefined {
    const marketPrice = getMarketPriceForToken(token)
    if (marketPrice === undefined || token?.metadata?.decimals === undefined) {
        return undefined
    }

    try {
        const fiatAmount = (marketPrice * tokenAmount) / 10 ** token.metadata.decimals
        return fiatAmount
    } catch {
        return undefined
    }
}
