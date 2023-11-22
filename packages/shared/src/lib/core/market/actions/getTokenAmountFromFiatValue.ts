import { ITokenWithBalance } from '@core/token/interfaces'
import { getMarketPriceForToken } from './getMarketPriceForToken'

export function getTokenAmountFromFiatValue(fiatAmount: string, token: ITokenWithBalance): number | undefined {
    const marketPrice = getMarketPriceForToken(token)
    if (marketPrice === undefined || token?.metadata?.decimals === undefined) {
        return undefined
    }

    try {
        const tokenAmount = (Number(fiatAmount) / marketPrice) * 10 ** token.metadata.decimals
        return Math.floor(tokenAmount)
    } catch {
        return undefined
    }
}
