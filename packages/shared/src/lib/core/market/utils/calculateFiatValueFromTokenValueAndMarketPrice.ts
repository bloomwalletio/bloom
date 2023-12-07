export function calculateFiatValueFromTokenValueAndMarketPrice(
    tokenValue: number,
    decimals: number | undefined,
    marketPrice: number | undefined
): number | undefined {
    if (marketPrice === undefined || decimals === undefined) {
        return undefined
    }

    try {
        const fiatAmount = (tokenValue / 10 ** decimals) * marketPrice
        return fiatAmount
    } catch {
        return undefined
    }
}
