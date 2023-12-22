export function calculateFiatValueFromTokenValueAndMarketPrice(
    tokenValue: bigint,
    decimals: number | undefined,
    marketPrice: number | undefined
): bigint | undefined {
    if (marketPrice === undefined || decimals === undefined) {
        return undefined
    }

    try {
        const fiatAmount = (tokenValue / BigInt(10) ** BigInt(decimals)) * BigInt(marketPrice)
        return fiatAmount
    } catch {
        return undefined
    }
}
