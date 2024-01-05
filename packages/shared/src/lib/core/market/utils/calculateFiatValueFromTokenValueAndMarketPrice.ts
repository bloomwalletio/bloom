import Big from 'big.js'

export function calculateFiatValueFromTokenValueAndMarketPrice(
    tokenValue: bigint,
    decimals: number | undefined,
    marketPrice: string | undefined
): string | undefined {
    if (marketPrice === undefined || decimals === undefined) {
        return undefined
    }

    try {
        const fiatAmount = new Big(tokenValue.toString()).div(10 ** decimals).mul(marketPrice)
        return fiatAmount.toString()
    } catch (err) {
        return undefined
    }
}
