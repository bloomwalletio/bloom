export function calculateFiatValueFromTokenValueAndMarketPrice(
    tokenValue: bigint,
    decimals: number | undefined,
    marketPrice: number | undefined
): number | undefined {
    if (marketPrice === undefined || decimals === undefined) {
        return undefined
    }

    try {
        const fiatAmount = (Number(tokenValue) / 10 ** decimals) * marketPrice
        return fiatAmount
    } catch (err) {
        return undefined
    }
}
