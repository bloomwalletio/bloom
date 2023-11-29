import { ITokenWithBalance } from '@core/token/interfaces'
import { getMarketPriceForToken } from './getMarketPriceForToken'

export function getTokenAmountFromFiatValue(fiatAmount: string, token: ITokenWithBalance): string | undefined {
    const marketPrice = getMarketPriceForToken(token)
    if (marketPrice === undefined || token?.metadata?.decimals === undefined) {
        return undefined
    }

    try {
        const tokenAmount = (Number(fiatAmount) / marketPrice) * 10 ** token.metadata.decimals
        return tokenAmount.toString()
    } catch {
        return undefined
    }
}
