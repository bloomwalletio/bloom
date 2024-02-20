export function calculateFiatValueFromTokenAmountAndMarketPrice(
    tokenAmount: bigint,
    decimals: number | undefined,
    marketPrice: string | undefined
): string | undefined {
    if (marketPrice === undefined || decimals === undefined) {
        return undefined
    }

    try {
        // TODO: We should improve this calculation to avoid rounding errors
        // Potentially we can just use the string representation of the token amount
        // and place the decimal point in the correct place
        const fiatValue = (Number(tokenAmount) / 10 ** decimals) * Number(marketPrice)
        return fiatValue.toString()
    } catch (err) {
        return undefined
    }
}
