import { ITokenWithBalance } from '@core/token/interfaces'
import { getMarketPriceForToken } from './getMarketPriceForToken'

export function getMarketAmountFromTokenValue(amount: number, token: ITokenWithBalance): number | undefined {
    const marketPrice = getMarketPriceForToken(token)
    if (marketPrice === undefined || token?.metadata?.decimals === undefined) {
        return undefined
    }

    try {
        const marketAmount = (marketPrice * amount) / 10 ** token.metadata.decimals
        return marketAmount
    } catch {
        return undefined
    }
}
