export function calculateFiatValueFromTokenValueAndMarketPrice(
    tokenValue: bigint,
    decimals: number | undefined,
    marketPrice: string | undefined
): string | undefined {
    if (marketPrice === undefined || decimals === undefined) {
        return undefined
    }

    try {
        const fiatAmount = (Number(tokenValue) / 10 ** decimals) * Number(marketPrice)
        return fiatAmount.toString()
    } catch (err) {
        return undefined
    }
}
